<?php

require_once __DIR__ . '/vendor/autoload.php';

use Venchiarutti\ProductsManagement\Infra\EntityManagerFactory;
use Doctrine\ORM\Tools\Console\ConsoleRunner;

return ConsoleRunner::createHelperSet(
    (new EntityManagerFactory())->create()
);