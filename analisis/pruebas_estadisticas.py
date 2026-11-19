"""Reproduce los cálculos del documento que se hicieron en Python, fuera de KNIME.

- Sección 3.4.1: tabla de k (inercia y silueta), estabilidad entre semillas (ARI)
  y análisis de sensibilidad con las variables conocidas al comprar.
- Sección 4.5: pruebas de H1, H2 y H4, y la significancia de los KPI 10 y 11.

Uso (desde la raíz del repositorio):
    pip install pandas numpy scipy scikit-learn
    python analisis/pruebas_estadisticas.py
"""
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import chi2_contingency, kruskal, mannwhitneyu
from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score, silhouette_score

DATOS = Path(__file__).resolve().parent.parent / "knime" / "datos"


def cramer_v(tabla):
    chi2, p, gl, _ = chi2_contingency(tabla, correction=False)
    n = tabla.values.sum()
    return chi2, p, gl, np.sqrt(chi2 / (n * (min(tabla.shape) - 1)))


def preparar(d, columnas):
    x = d[columnas].copy()
    for c in ("total_precio", "total_flete"):
        if c in x:
            x[c] = np.log1p(x[c])
    return (x - x.mean()) / x.std()


def tabla_k(z, ks, semillas=(1, 2, 3), muestra=10_000):
    idx = np.random.RandomState(0).choice(len(z), muestra, replace=False)
    filas = []
    for k in ks:
        inercia, silueta = [], []
        for s in semillas:
            km = KMeans(k, n_init=1, random_state=s).fit(z)
            inercia.append(km.inertia_)
            silueta.append(silhouette_score(z.values[idx], km.labels_[idx]))
        filas.append((k, np.mean(inercia), np.mean(silueta)))
    return pd.DataFrame(filas, columns=["k", "inercia", "silueta"])


def main():
    d = pd.read_csv(DATOS / "ordenes_etl.csv")
    seg = pd.read_csv(DATOS / "segmentos_modelo1.csv")
    cli = pd.read_csv(DATOS / "clientes_kpi.csv")

    print("== Sección 3.4.1: elección de k (6 variables)")
    z = preparar(d, ["total_precio", "total_flete", "max_cuotas", "dias_entrega", "dias_retraso", "mismo_estado"])
    print(tabla_k(z, range(2, 9)).round({"inercia": 0, "silueta": 3}).to_string(index=False))
    etiquetas = [KMeans(4, n_init=1, random_state=s).fit(z).labels_ for s in range(5)]
    print("ARI entre semillas (k = 4):", [round(adjusted_rand_score(etiquetas[0], e), 3) for e in etiquetas[1:]])

    print("\n== Sección 3.4.1: sensibilidad (4 variables conocidas al comprar)")
    z4 = preparar(d, ["total_precio", "total_flete", "max_cuotas", "mismo_estado"])
    print(tabla_k(z4, (3, 4, 5)).round({"inercia": 0, "silueta": 3}).to_string(index=False))
    g = KMeans(3, n_init=10, random_state=1).fit(z4).labels_
    r = d.assign(g=g).dropna(subset=["review_promedio"])
    print("Calificación por grupo:", r.groupby("g").review_promedio.mean().round(2).tolist())
    print("Kruskal-Wallis:", kruskal(*[r.review_promedio[r.g == i] for i in sorted(r.g.unique())]))

    print("\n== Sección 4.5")
    r = d.dropna(subset=["review_promedio"])
    tarde, tiempo = r.review_promedio[r.es_tardio == 1], r.review_promedio[r.es_tardio == 0]
    u = mannwhitneyu(tarde, tiempo)
    print(f"H1 Mann-Whitney: U = {u.statistic:,.0f}, p = {u.pvalue:.3g}, "
          f"correlación biserial de rangos = {1 - 2 * u.statistic / (len(tarde) * len(tiempo)):.2f}")
    print("H1 χ² reseñas negativas: χ² = %.0f, p = %.3g, gl = %d, V = %.2f" % cramer_v(pd.crosstab(r.es_tardio, r.review_promedio <= 2)))
    print("H2 χ² por estado: χ² = %.0f, p = %.3g, gl = %d, V = %.2f" % cramer_v(pd.crosstab(d.customer_state, d.es_tardio)))
    print("H2 χ² mismo estado: χ² = %.0f, p = %.3g, gl = %d, V = %.2f" % cramer_v(pd.crosstab(d.mismo_estado, d.es_tardio)))
    fecha = pd.to_datetime(d.order_purchase_timestamp)
    for nombre, m in (("hasta marzo de 2018", fecha < "2018-04-01"), ("abril a agosto de 2018", fecha >= "2018-04-01")):
        x = d[m]
        chi2, p, _, _ = cramer_v(pd.crosstab(x.mismo_estado, x.es_tardio))
        print(f"   {nombre}: mismo estado {x[x.mismo_estado == 1].es_tardio.mean():.1%}, "
              f"distinto {x[x.mismo_estado == 0].es_tardio.mean():.1%}, χ² = {chi2:.1f}, p = {p:.3g}")
    m = d.merge(seg, on="order_id").dropna(subset=["review_promedio"])
    print("H4 Kruskal-Wallis (asignación de KNIME):", kruskal(*[m.review_promedio[m.Cluster == c] for c in sorted(m.Cluster.unique())]))

    c = cli[cli.primer_en_2017.astype(str).str.lower().isin(["1", "true"])]
    for col, nombre in (("primer_pedido_tardio", "KPI 10 (puntualidad)"), ("primer_pedido_negativo", "KPI 11 (reseña)")):
        t = pd.crosstab(c[col], c.recompra)
        chi2, p, gl, _ = chi2_contingency(t, correction=False)
        print(f"{nombre}: tasas {c.groupby(col).recompra.mean().round(4).to_dict()}, n {c[col].value_counts().to_dict()}, "
              f"χ² = {chi2:.2f}, gl = {gl}, p = {p:.3g}")


if __name__ == "__main__":
    main()
