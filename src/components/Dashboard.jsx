import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = ({ movimientos }) => {
  // Procesar los datos para el gráfico de barras
  const datosPorMes = movimientos.reduce((acc, movimiento) => {
    const fecha = new Date(movimiento.fecha);
    const mes = fecha.toLocaleString("default", { month: "long" });
    if (!acc[mes]) {
      acc[mes] = { ingresos: 0, gastos: 0 };
    }
    if (movimiento.tipo === "ingreso") {
      acc[mes].ingresos += movimiento.monto;
    } else {
      acc[mes].gastos += movimiento.monto;
    }
    return acc;
  }, {});

  const datosGrafico = Object.entries(datosPorMes).map(([mes, datos]) => ({
    mes,
    ingresos: datos.ingresos,
    gastos: datos.gastos,
  }));

  // Procesar los datos para el gráfico circular
  const totalIngresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((sum, m) => sum + m.monto, 0);
  const totalGastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((sum, m) => sum + m.monto, 0);

  const datosPie = [
    { name: "Ingresos", value: totalIngresos },
    { name: "Gastos", value: totalGastos },
  ];

  const COLORS = ["#4ade80", "#f87171"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Ingresos y Gastos por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={datosGrafico}>
              <XAxis
                dataKey="mes"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="ingresos"
                fill="#4ade80"
                name="Ingresos"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="gastos"
                fill="#f87171"
                name="Gastos"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Ingresos y Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={datosPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {datosPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
