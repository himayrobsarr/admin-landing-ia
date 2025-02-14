import { useState } from "react"
import { Users, DollarSign, ShoppingCart, Sun, Moon, Download } from "lucide-react"

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const stats = [
    { title: "Total Usuarios", value: "1,234", icon: Users },
    { title: "Ingresos", value: "$10,234", icon: DollarSign },
    { title: "Pedidos", value: "356", icon: ShoppingCart },
  ]

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark')
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Panel de Administración</h1>
        <div className="theme-toggle">
          <Sun className="icon" />
          <button className="toggle-button" onClick={toggleTheme}>
            <div className="toggle-thumb"></div>
          </button>
          <Moon className="icon" />
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <stat.icon size={20} />
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Datos Recientes</h2>
          <button className="download-button">
            <Download size={16} />
            Descargar
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>Usuario {i + 1}</td>
                <td>${Math.floor(Math.random() * 1000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App