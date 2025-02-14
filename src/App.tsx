import { useState, useEffect } from "react"
import { Users, DollarSign, ShoppingCart, Sun, Moon, Download } from "lucide-react"
import * as XLSX from 'xlsx'

interface Registration {
  id: number
  name: string
  lastname: string
  email: string
  phone: string
  document: string
  payment_reference: string
  payment_date: string
  selected_course: string
  created_at: string
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const stats = [
    { title: "Total Usuarios", value: "1,234", icon: Users },
    { title: "Ingresos", value: "$10,234", icon: DollarSign },
    { title: "Pedidos", value: "356", icon: ShoppingCart },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/landing-ia/registros`)
        const result = await response.json()
        if (result.success) {
          setRegistrations(result.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownload = () => {
    // Preparar los datos para Excel
    const excelData = registrations.map(reg => ({
      'ID': reg.id,
      'Nombre': reg.name,
      'Apellido': reg.lastname,
      'Email': reg.email,
      'Teléfono': reg.phone,
      'Documento': reg.document,
      'Referencia de Pago': reg.payment_reference,
      'Fecha de Pago': new Date(reg.payment_date).toLocaleDateString('es-ES'),
      'Fecha del Curso': new Date(reg.selected_course).toLocaleDateString('es-ES'),
      'Fecha de Registro': new Date(reg.created_at).toLocaleDateString('es-ES')
    }))

    // Crear el libro de trabajo
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Ajustar el ancho de las columnas
    const columnsWidth = [
      { wch: 5 },  // ID
      { wch: 15 }, // Nombre
      { wch: 15 }, // Apellido
      { wch: 25 }, // Email
      { wch: 12 }, // Teléfono
      { wch: 12 }, // Documento
      { wch: 20 }, // Referencia de Pago
      { wch: 15 }, // Fecha de Pago
      { wch: 15 }, // Fecha del Curso
      { wch: 15 }  // Fecha de Registro
    ]
    worksheet['!cols'] = columnsWidth

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros')

    // Generar el archivo y descargarlo
    XLSX.writeFile(workbook, `Registros_${new Date().toISOString().split('T')[0]}.xlsx`)
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
          <h2>Registros Recientes</h2>
          <button className="download-button" onClick={handleDownload}>
            <Download size={16} />
            Descargar Excel
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Referencia de Pago</th>
              <th>Fecha de Pago</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>{registration.id}</td>
                <td>{`${registration.name} ${registration.lastname}`}</td>
                <td>{registration.email}</td>
                <td>{registration.phone}</td>
                <td>{registration.document}</td>
                <td>{registration.payment_reference}</td>
                <td>{formatDate(registration.payment_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App