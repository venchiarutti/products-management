<?php

require __DIR__ . '/vendor/autoload.php';

use Venchiarutti\ProductsManagement\Controller\{
    ProductNew,
    ProductList,
    ProductDelete
};

$routes = [
    ['POST', '/api/product/new', ProductNew::class],
    ['POST', '/api/product/delete', ProductDelete::class],
    ['GET', '/api/product/list', ProductList::class],
    ['GET', '/product/list', 'public/product-list.html'],
    ['GET', '/product/new', 'public/product-new.html']
];

foreach ($routes as $route) {
    list($method, $uri, $class) = $route;
    if ($_SERVER['REQUEST_METHOD'] === $method && preg_match("#^$uri$#", $_SERVER['REQUEST_URI'], $matches)) {
        if (str_starts_with($_SERVER['REQUEST_URI'], "/api")) {
            array_shift($matches);
            $controller = new $class();

            if ($method === 'POST') {
                $json = file_get_contents('php://input');
                $data = json_decode($json, true);
                $result = call_user_func([$controller, 'handle'], $data);
            } else {
                $result = call_user_func([$controller, 'handle']);
            }

            header('Content-Type: application/json');
            echo json_encode($result);
            exit();
        }
        header('Location: /' . $class);
        exit();
    }
}

header('Location: /public/product-list.html');
exit();