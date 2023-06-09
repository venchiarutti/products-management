<?php

namespace Venchiarutti\ProductsManagement\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Venchiarutti\ProductsManagement\Entity\Product;
use Venchiarutti\ProductsManagement\Infra\EntityManagerFactory;
use Venchiarutti\ProductsManagement\Services\AttributeHandler;

class ProductList
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

    public function handle(): array
    {
        $products = $this->entityManager->getRepository(Product::class)->findAll();

        $productsInfo = [];

        foreach ($products as $product) {
            $attribute = self::ATTRIBUTES[$product->getType()];
            $productsInfo[] = [
                "id" => $product->getId(),
                "name" => $product->getName(),
                "sku" => $product->getSku(),
                "attributes" => [
                    $attribute => $this->attributeHandler->getCustomAttribute($attribute, $product)->getValue()
                ],
                "price" => $product->getPrice()
            ];
        }

        return $productsInfo;
    }
}