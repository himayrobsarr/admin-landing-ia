import { useState, useEffect } from "react";
import { Users, DollarSign, Sun, Moon, Download } from "lucide-react";
import * as XLSX from 'xlsx';

interface Registration {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  document: string;
  payment_reference: string;
  payment_date: string;
  selected_course: string;
  created_at: string;
  status: string;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  // Fetch de registros
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}landing-ia/registros`);
        const result = await response.json();
        if (result.success) {
          setRegistrations(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch para obtener el total de usuarios confirmados
  useEffect(() => {
    const fetchConfirmedCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}landing-ia/registros/confirmed`);
        const result = await response.json();
        if (result.success && result.data) {
          // Suponemos que result.data es un objeto con la propiedad "total"
          setConfirmedCount(result.data.total);
          setTotalIncome(result.data.total * 97000);
        }
      } catch (error) {
        console.error('Error fetching confirmed count:', error);
      }
    };

    fetchConfirmedCount();
  }, []);

  // Actualizamos el valor en los stats con el total obtenido
  const stats = [
    { title: "Total de Registros Confirmados", value: confirmedCount, icon: Users },
    { title: "Ingresos Totales Estimados", value: totalIncome, icon: DollarSign }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('-'); // Divide YYYY-MM-DD
    const fixedDate = new Date(
      parseInt(dateParts[0]),  // Año
      parseInt(dateParts[1]) - 1,  // Mes (JavaScript lo cuenta desde 0)
      parseInt(dateParts[2])   // Día
    );
    return fixedDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  

  const handleDownload = () => {
    const excelData = registrations.map(reg => ({
      'ID': reg.id,
      'Nombre': reg.name,
      'Apellido': reg.lastname,
      'Email': reg.email,
      'Teléfono': reg.phone,
      'Documento': reg.document,
      'Referencia de Pago': reg.payment_reference,
      'Fecha de Pago': new Date(reg.payment_date).toLocaleDateString('es-ES'),
      'Curso Seleccionado': new Date(reg.selected_course).toLocaleDateString('es-ES'),
      'Estado del Pago': reg.status
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const columnsWidth = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    worksheet['!cols'] = columnsWidth;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
    XLSX.writeFile(workbook, `Registros_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Panel de Administración - Cursos IA</h1>
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
              <th>Curso Seleccionado</th>
              <th>Estado del pago</th>
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
                <td>{formatDate(registration.selected_course)}</td>
                <td>{registration.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
