import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Utensils, Pill, ShoppingCart, Star, Coffee, Beer, Landmark, ExternalLink, Wifi } from 'lucide-react'

const ALOJAMIENTO_ADDRESS = "Travessa da Trindade 18"

// Simula una llamada a la API de Google Places
const fetchNearbyPlaces = async () => {
  // En una aplicación real, esto sería una llamada a tu backend, que a su vez llamaría a la API de Google Places
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simula un retraso de red
  
  return [
    { name: "Restaurante A Brasileira", type: "restaurant", address: "Rua Garrett 120", rating: 4.5, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: true },
    { name: "Farmácia Estácio", type: "pharmacy", address: "Rua da Misericórdia 14", rating: 4.2, image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: true },
    { name: "Mercado da Baixa", type: "supermarket", address: "Rua da Prata 52", rating: 4.0, image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: false },
    { name: "Café Nicola", type: "cafe", address: "Praça Dom Pedro IV 24", rating: 4.7, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: true },
    { name: "Ginjinha Sem Rival", type: "bar", address: "Rua das Portas de Santo Antão 7", rating: 4.3, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: false },
    { name: "Elevador de Santa Justa", type: "attraction", address: "Rua do Ouro", rating: 4.8, image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", important: true },
  ]
}

type PlaceType = 'all' | 'restaurant' | 'pharmacy' | 'supermarket' | 'cafe' | 'bar' | 'attraction'

interface Place {
  name: string
  type: PlaceType
  address: string
  rating: number
  image: string
  important: boolean
}

function App() {
  const [places, setPlaces] = useState<Place[]>([])
  const [filter, setFilter] = useState<PlaceType>('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true)
      try {
        const nearbyPlaces = await fetchNearbyPlaces()
        setPlaces(nearbyPlaces)
      } catch (error) {
        console.error("Error fetching nearby places:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlaces()
  }, [])

  const filteredPlaces = places.filter(place => filter === 'all' || place.type === filter)

  const FilterButton = ({ type, icon: Icon }: { type: PlaceType; icon: React.ElementType }) => (
    <button 
      className={`mr-2 mb-2 px-4 py-2 rounded-full transition-all duration-300 ${filter === type ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'}`}
      onClick={() => setFilter(type)}
    >
      <Icon className="inline mr-1" size={18} /> {type.charAt(0).toUpperCase() + type.slice(1)}s
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-blue-600 text-white py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-2">Bienvenido a tu Alojamiento Local</h1>
          <p className="text-xl">Descubre los mejores lugares cercanos</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Información del alojamiento</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-500" />
              <p>{ALOJAMIENTO_ADDRESS}</p>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 text-blue-500" />
              <p>+351 123 456 789</p>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-blue-500" />
              <p>Check-in: 15:00 - Check-out: 11:00</p>
            </div>
            <div className="flex items-center">
              <Wifi className="mr-2 text-blue-500" />
              <p>WiFi: AlojamientoLocal_Guest / Pass: welcome2023</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Lugares cercanos</h2>
          <div className="flex mb-6 flex-wrap">
            <FilterButton type="all" icon={() => <span className="mr-1">🏙️</span>} />
            <FilterButton type="restaurant" icon={Utensils} />
            <FilterButton type="pharmacy" icon={Pill} />
            <FilterButton type="supermarket" icon={ShoppingCart} />
            <FilterButton type="cafe" icon={Coffee} />
            <FilterButton type="bar" icon={Beer} />
            <FilterButton type="attraction" icon={Landmark} />
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando lugares cercanos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place, index) => (
                <div key={index} className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${place.important ? 'border-2 border-yellow-400' : ''}`}>
                  <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {place.name}
                      {place.important && <span className="ml-2 text-yellow-500">⭐ Destacado</span>}
                    </h3>
                    <p className="text-gray-600 mb-2">{place.address}</p>
                    <p className="flex items-center mb-4">
                      <Star className="mr-1 text-yellow-400" />
                      {place.rating} / 5
                    </p>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      Ver en Google Maps <ExternalLink className="ml-1" size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-blue-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Alojamiento Local. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App