"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, Trash2, Edit2, Check, X, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { useTheme } from "./theme-provider"
import Dashboard from "./components/Dashboard"
import { useAuth } from "./AuthContext"

// Función para formatear números con puntos cada tres dígitos
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

// Función para formatear la fecha
const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export default function RegistroGastos() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [dineroInicial, setDineroInicial] = useState("")
  const [saldoActual, setSaldoActual] = useState(0)
  const [movimientos, setMovimientos] = useState([])
  const [descripcion, setDescripcion] = useState("")
  const [monto, setMonto] = useState("")
  const [tipo, setTipo] = useState("gasto")
  const [editandoId, setEditandoId] = useState(null)
  const [descripcionEditada, setDescripcionEditada] = useState("")
  const [montoEditado, setMontoEditado] = useState("")
  const [tipoEditado, setTipoEditado] = useState("gasto")

  useEffect(() => {
    if (!user) {
      navigate('/auth')
    }
  }, [user, navigate])

  useEffect(() => {
    if (dineroInicial) {
      const totalIngresos = movimientos
        .filter(m => m.tipo === "ingreso")
        .reduce((total, m) => total + m.monto, 0)
      const totalGastos = movimientos
        .filter(m => m.tipo === "gasto")
        .reduce((total, m) => total + m.monto, 0)
      setSaldoActual(parseFloat(dineroInicial) + totalIngresos - totalGastos)
    }
  }, [dineroInicial, movimientos])

  const agregarMovimiento = (e) => {
    e.preventDefault()
    if (descripcion && monto) {
      const nuevoMovimiento = {
        id: Date.now(),
        descripcion,
        monto: parseFloat(monto),
        tipo,
        fecha: new Date()
      }
      setMovimientos([...movimientos, nuevoMovimiento])
      setDescripcion("")
      setMonto("")
      setTipo("gasto")
    }
  }

  const eliminarMovimiento = (id) => {
    setMovimientos(movimientos.filter((movimiento) => movimiento.id !== id))
  }

  const iniciarEdicion = (movimiento) => {
    setEditandoId(movimiento.id)
    setDescripcionEditada(movimiento.descripcion)
    setMontoEditado(movimiento.monto.toString())
    setTipoEditado(movimiento.tipo)
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setDescripcionEditada("")
    setMontoEditado("")
    setTipoEditado("gasto")
  }

  const guardarEdicion = (id) => {
    setMovimientos(movimientos.map((movimiento) =>
      movimiento.id === id ? { ...movimiento, descripcion: descripcionEditada, monto: parseFloat(montoEditado), tipo: tipoEditado } : movimiento
    ))
    setEditandoId(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const totalGastos = movimientos
    .filter(m => m.tipo === "gasto")
    .reduce((total, m) => total + m.monto, 0)
  const totalIngresos = movimientos
    .filter(m => m.tipo === "ingreso")
    .reduce((total, m) => total + m.monto, 0)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Registro de Gastos</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="bg-muted">
            <CardTitle className="text-2xl font-semibold">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div>
                <span className="font-medium text-muted-foreground">Dinero Inicial:</span>
                <span className="ml-2">$
                  {formatNumber(parseFloat(dineroInicial || 0).toFixed())}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Total Gastos:</span>
                <span className="ml-2 text-red-500">$
                  {formatNumber(totalGastos.toFixed())}
                </span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Total Ingresos:</span>
                <span className="ml-2 text-green-500">$
                  {formatNumber(totalIngresos.toFixed())}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">Saldo Actual:</span>
                <span className={`ml-2 font-semibold ${saldoActual < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${formatNumber(saldoActual.toFixed())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="bg-muted">
            <CardTitle className="text-2xl font-semibold">Registro de Movimientos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <Label htmlFor="dineroInicial" className="text-muted-foreground">Dinero Inicial</Label>
              <Input
                id="dineroInicial"
                type="text"
                value={dineroInicial}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, "")
                  if (/^\d*$/.test(value)) {
                    setDineroInicial(value)
                  }
                }}
                placeholder="Ingrese el dinero inicial"
                required
                className="mt-1"
              />
            </div>
            <form onSubmit={agregarMovimiento} className="space-y-4">
              <div>
                <Label htmlFor="descripcion" className="text-muted-foreground">Descripción</Label>
                <Input
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ingrese la descripción"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="monto" className="text-muted-foreground">Monto</Label>
                <Input
                  id="monto"
                  type="text"
                  value={monto}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\./g, "")
                    if (/^\d*$/.test(value)) {
                      setMonto(value)
                    }
                  }}
                  placeholder="Ingrese el monto"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo</Label>
                <RadioGroup value={tipo} onValueChange={setTipo} className="flex space-x-4 mt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gasto" id="gasto" />
                    <Label htmlFor="gasto">Gasto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ingreso" id="ingreso" />
                    <Label htmlFor="ingreso">Ingreso</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar {tipo === "gasto" ? "Gasto" : "Ingreso"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="bg-muted">
            <CardTitle className="text-2xl font-semibold">Lista de Movimientos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {movimientos.length === 0 ? (
              <p className="text-center text-muted-foreground">No hay movimientos registrados.</p>
            ) : (
              <ul className="space-y-4">
                {movimientos.map((movimiento) => (
                  <li key={movimiento.id} className="flex items-center justify-between border-b pb-2">
                    {editandoId === movimiento.id ? (
                      <>
                        <Input
                          value={descripcionEditada}
                          onChange={(e) => setDescripcionEditada(e.target.value)}
                          className="w-1/3 mr-2"
                        />
                        <Input
                          type="text"
                          value={montoEditado}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "")
                            if (/^\d*$/.test(value)) {
                              setMontoEditado(value)
                            }
                          }}
                          className="w-1/4 mr-2"
                        />
                        <RadioGroup value={tipoEditado} onValueChange={setTipoEditado} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="gasto" id={`gasto-${movimiento.id}`} />
                            <Label htmlFor={`gasto-${movimiento.id}`}>Gasto</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ingreso" id={`ingreso-${movimiento.id}`} />
                            <Label htmlFor={`ingreso-${movimiento.id}`}>Ingreso</Label>

                          </div>
                        </RadioGroup>
                        <div>
                          <Button variant="outline" size="icon" onClick={() => guardarEdicion(movimiento.id)} className="mr-2">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={cancelarEdicion}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col">
                          <span className="font-medium">{movimiento.descripcion}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(movimiento.fecha)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`mr-4 ${movimiento.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}`}>
                            ${formatNumber(movimiento.monto.toFixed(2))}
                          </span>
                          <span className={`mr-4 ${movimiento.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}`}>
                            {movimiento.tipo === 'gasto' ? 'Gasto' : 'Ingreso'}
                          </span>
                          <Button variant="outline" size="icon" onClick={() => iniciarEdicion(movimiento)} className="mr-2">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => eliminarMovimiento(movimiento.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Dashboard movimientos={movimientos} />

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          Alan Gabriel Sastre Briceño
        </footer>
      </div>
    </div>
  )
}