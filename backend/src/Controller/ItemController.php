<?php

namespace App\Controller;

use App\Repository\ItemRepository;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use function Symfony\Component\DependencyInjection\Loader\Configurator\env;

final class ItemController extends AbstractController
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    #[Route('api/items', name: 'app_item')]
    public function index(Request $request, ItemRepository $repository): JsonResponse
    {
        $sort = $request->query->get('sort', 'asc');
        $minPrice = $request->query->get('minPrice');

        $items = $repository->findWithFilters($sort, $minPrice);

        $result = array_map(function($item) {
            return [
                'id' => $item->getId(),
                'name' => $item->getName(),
                'price' => $item->getPrice(),
                'created_at' => $item->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $items);

        return $this->json([
            'status' => 'success',
            'data' => $result,
            'meta' => [
                'count' => count($result),
                'sort' => $sort,
                'min_price' => $minPrice ? (int) $minPrice : null,
            ]
        ]);
    }

    /**
     * @throws Exception
     */
    #[Route('api/search', name: 'search_item')]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->get('search');

        // Обезопасили от инъекции, передав параметризованный запрос
        $sql = "SELECT * FROM items WHERE name LIKE :query";
        $result = $this->connection->executeQuery($sql, [
            'query' => '%' . $query . '%'
        ]);

        return new JsonResponse([
            'status' => 'success',
            'data' => $result->fetchAllAssociative()
        ]);
    }
}
