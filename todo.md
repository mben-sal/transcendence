- problem de | Unauthorized: /api/users/logout/
- resoudre problem de twofactor (implement twofactor authentification par cercode)
- teste bien le travail inscreption
- erreur dans 
backend   | [06/Feb/2025 10:39:39] "OPTIONS /api/users/profile/ HTTP/1.1" 200 0
backend   | Unauthorized: /api/users/profile/
backend   | [06/Feb/2025 10:39:39] "GET /api/users/profile/ HTTP/1.1" 401 183

- fixed 2fac dans meme page meme pas donner un autre path
- problem de setting save pour desactive 2fac 
- ajouter 2fac dans le cas user pas 42