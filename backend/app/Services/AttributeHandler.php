<?php
namespace Venchiarutti\ProductsManagement\Services;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Venchiarutti\ProductsManagement\Entity\Attribute;
use Venchiarutti\ProductsManagement\Entity\Product;
use Venchiarutti\ProductsManagement\Entity\ProductAttribute;
use Venchiarutti\ProductsManagement\Infra\EntityManagerFactory;

class AttributeHandler
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @var Attribute|null
     */
    private ?Attribute $attribute;

    /**
     * @throws \Exception
     */
    public function __construct()
    {
        $this->entityManager = (new EntityManagerFactory())->create();
    }

    /**
     * @param string $attribute
     * @param string $value
     * @param Product $product
     * @return self
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function setCustomAttribute(string $attribute, string $value, Product $product): self
    {
        $productAttribute = $this->getCustomAttribute($attribute, $product);

        if ($productAttribute === null) {
            $productAttribute = new ProductAttribute();
        }

        $productAttribute->setProduct($product)
            ->setAttribute($this->attribute)
            ->setValue($value);

        $this->entityManager->persist($productAttribute);
        $this->entityManager->flush();

        return $this;
    }

    /**
     * @param string $attribute
     * @param Product $product
     * @return null|ProductAttribute
     */
    public function getCustomAttribute(string $attribute, Product $product): ?ProductAttribute
    {
        $this->attribute = $this->entityManager->getRepository(Attribute::class)
            ->findOneBy(["name" => $attribute]);

        return $this->entityManager->getRepository(ProductAttribute::class)
            ->findOneBy(["product" => $product, "attribute" => $this->attribute]);
    }
}
