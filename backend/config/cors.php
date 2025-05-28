<?php

return [
    'paths' => ['api/*'], // Habilita CORS para todas as rotas da API
    'allowed_methods' => ['*'], // Permite todos os métodos
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Permite todos os headers
    'exposed_headers' => [],
    'max_age' => 86400, // 24 horas
    'supports_credentials' => true,
];
