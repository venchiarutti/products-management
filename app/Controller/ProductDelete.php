<?php

namespace Venchiarutti\ProductsManagement\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Venchiarutti\ProductsManagement\Entity\Product;
use Venchiarutti\ProductsManagement\Infra\EntityManagerFactory;

class ProductDelete
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->entityManager = (new EntityManagerFactory())->create();
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     */
    public function handle(array $data): bool
    {
        $queryBuilder = $this->entityManager->createQueryBuilder();

        $query = $queryBuilder->select('e')
            ->from(Product::class, 'e')
            ->where($queryBuilder->expr()->in('e.id', $data['ids']))
            ->getQuery();

        $entities = $query->getResult();

        foreach ($entities as $entity) {
            $this->entityManager->remove($entity);
        }
        $this->entityManager->flush();
        return true;
    }
}