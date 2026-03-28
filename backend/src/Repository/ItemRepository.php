<?php

namespace App\Repository;

use App\Entity\Item;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Item>
 */
class ItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Item::class);
    }

    public function findWithFilters(?string $sort = 'asc', ?int $minPrice = null): array
    {
        $qb = $this->createQueryBuilder('i');

        if ($minPrice !== null && $minPrice > 0) {
            $qb->andWhere('i.price > :minPrice')
                ->setParameter('minPrice', $minPrice);
        }

        $sortOrder = strtoupper($sort) === 'DESC' ? 'DESC' : 'ASC';
        $qb->orderBy('i.price', $sortOrder);

        return $qb->getQuery()->getResult();
    }
}
