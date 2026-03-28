import { useState, useMemo } from 'react'
import './styles/ItemsPage.scss'

interface Item {
    id: number
    name: string
    price: number
}

const ItemsPage = () => {
    const [allItems, setAllItems] = useState<Item[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [backendSort, setBackendSort] = useState<'asc' | 'desc'>('asc')
    const [backendMinPrice, setBackendMinPrice] = useState<number>(0)

    const [searchTerm, setSearchTerm] = useState('')
    const [frontendSort, setFrontendSort] = useState<'asc' | 'desc'>('asc')
    const [frontendMinPrice, setFrontendMinPrice] = useState<number>(0)

    const fetchItems = async () => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            params.append('sort', backendSort)

            if (backendMinPrice > 0) {
                params.append('minPrice', backendMinPrice.toString())
            }

            const url = `/api/items${params.toString() ? `?${params.toString()}` : ''}`
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

    const displayedItems = useMemo(() => {
        let result = [...allItems]

        if (frontendMinPrice > 0) {
            result = result.filter(item => item.price >= frontendMinPrice)
        }

        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase()
            result = result.filter(item =>
                item.name.toLowerCase().includes(lowerSearch)
            )
        }

        result.sort((a, b) => {
            return frontendSort === 'asc' ? a.price - b.price : b.price - a.price
        })

        return result
    }, [allItems, searchTerm, frontendSort, frontendMinPrice])

    const resetAll = () => {
        setBackendSort('asc')
        setBackendMinPrice(0)
        setSearchTerm('')
        setFrontendSort('asc')
        setFrontendMinPrice(0)
    }

    return (
        <div className="items-page">
            <h2>Товары</h2>

            <div className="filters backend-filters">
                <h3>Фильтры запроса</h3>
                <div className="filter-group">
                    <select
                        value={backendSort}
                        onChange={(e) => setBackendSort(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="asc">Сортировка на бэке: дешевые ↑</option>
                        <option value="desc">Сортировка на бэке: дорогие ↓</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Мин. цена на бэке"
                        value={backendMinPrice || ''}
                        onChange={(e) => setBackendMinPrice(Number(e.target.value))}
                    />

                    <button onClick={fetchItems} disabled={loading}>
                        {loading ? '...' : 'Загрузить'}
                    </button>
                </div>
            </div>

            {allItems.length > 0 && (
                <div className="filters frontend-filters">
                    <h3>Фильтры в загруженных данных</h3>
                    <div className="filter-group">
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            value={frontendSort}
                            onChange={(e) => setFrontendSort(e.target.value as 'asc' | 'desc')}
                        >
                            <option value="asc">Сортировка: дешевые ↑</option>
                            <option value="desc">Сортировка: дорогие ↓</option>
                        </select>

                        <input
                            type="number"
                            placeholder="Мин. цена"
                            value={frontendMinPrice || ''}
                            onChange={(e) => setFrontendMinPrice(Number(e.target.value))}
                        />
                    </div>
                </div>
            )}

            <button onClick={resetAll} className="reset-all">
                Сбросить всё
            </button>

            {loading && <div className="loading">Загрузка...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && allItems.length > 0 && (
                <>
                    <div className="count">
                        Показано: {displayedItems.length} из {allItems.length}
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

                    {displayedItems.length === 0 && (
                        <div className="empty">Ничего не найдено в загруженных данных</div>
                    )}
                </>
            )}

            {!loading && !error && allItems.length === 0 && (
                <div className="empty">Нажмите "Загрузить" для получения товаров</div>
            )}
        </div>
    )
}

export default ItemsPage