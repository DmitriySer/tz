import { useState, useMemo } from 'react'
import './styles/ItemsPage.scss'

interface Item {
    id: number
    name: string
    price: number
}

const SearchPage = () => {
    const [allItems, setAllItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [backendSearch, setBackendSearch] = useState('')

    const fetchItems = async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()

            if (backendSearch.trim()) {
                params.append('search', backendSearch.trim())
            }

            const url = `/api/search${params.toString() ? `?${params.toString()}` : ''}`
            const response = await fetch(url)
            const data = await response.json()

            if (data.status === 'success') {
                setAllItems(data.data)
            } else {
                throw new Error(data.message)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка')
        } finally {
            setLoading(false)
        }
    }

    const displayedItems = allItems

    return (
        <div className="items-page">
            <h2>Простой поиск (регистрозависимый)</h2>
            <div className="filters backend-filters">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={backendSearch}
                        onChange={(e) => setBackendSearch(e.target.value)}
                    />
                    <button onClick={fetchItems} disabled={loading}>
                        {loading ? 'Поиск...' : 'Найти'}
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Загрузка...</div>}

            {error && <div className="error">{error}</div>}

            {!loading && !error && allItems.length > 0 && (
                <>
                    <div className="count">
                        Найдено: {displayedItems.length} товаров
                        {backendSearch && ` по запросу "${backendSearch}"`}
                    </div>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Цена</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.price} ₽</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}

            {!loading && !error && allItems.length === 0 && backendSearch && (
                <div className="empty">Ничего не найдено по запросу "{backendSearch}"</div>
            )}

            {!loading && !error && allItems.length === 0 && !backendSearch && (
                <div className="empty">Введите запрос и нажмите "Найти"</div>
            )}
        </div>
    )
}

export default SearchPage