<?php

namespace Venchiarutti\ProductsManagement\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Venchiarutti\ProductsManagement\Entity\Product;
use Venchiarutti\ProductsManagement\Infra\EntityManagerFactory;
use Venchiarutti\ProductsManagement\Services\AttributeHandler;

class ProductNew
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @var AttributeHandler
     */
    private AttributeHandler $attributeHandler;

    private const ATTRIBUTES = [
        "Book" => "weight",
        "Furniture" => "dimensions",
        "DVD" => "size"
    ];

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->entityManager = (new EntityManagerFactory())->create();
        $this->attributeHandler = new AttributeHandler();
    }

    public function handle(array $data): bool
    {
        try {
            $product = new Product();

            $product->setName($data["name"])
                ->setSku($data["sku"])
                ->setType($data["type"])
                ->setPrice($data["price"]);

            $requiredAttribute = self::ATTRIBUTES[$data["type"]];

            if (!isset($data["attributes"][$requiredAttribute])) {
                throw new \InvalidArgumentException("Required attribute is missing");
            }

            foreach($data["attributes"] as $name => $value) {
                $this->attributeHandler->setCustomAttribute($name, $value, $product);
            }

            return true;
        } catch (\Exception) {
            return false;
        }
    }
}