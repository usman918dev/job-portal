# Test Admin Routes Protection

## Test with correct admin credentials:
```bash
curl -X POST http://localhost:5000/api/auth/admin-signin \
  -H "Content-Type: application/json" \
  -d '{"email":"zainkhokhar@gmail.com","password":"Zain_khokhar@1"}'
```

## Test accessing protected route without admin auth (should fail):
```bash
curl http://localhost:5000/api/users
```

## Test accessing protected route with admin auth (should work):
```bash
curl http://localhost:5000/api/users \
  -H "x-admin-auth: admin-authenticated"
```

## Test with wrong admin credentials (should fail):
```bash
curl -X POST http://localhost:5000/api/auth/admin-signin \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'
```