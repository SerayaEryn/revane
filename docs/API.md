# API

## revane(): Revane

Returns a new instance of `Revane`.

## Revane

### Revane#register(id: string): Revane

### Revane#registerControllers(): Revane

### Revane#setErrorHandler(id: string): Revane

### Revane#setNotFoundHandler(id: string): Revane

### Revane#basePackage(path: string): Revane

### Revane#componentScan(path: string): Revane

### Revane#xmlFile(file: string): Revane

### Revane#noRedefinition(noRedefinition?: boolean): Revane

Prevents the duplicate defininion of beans. If a duplicate definition is found an error will be thrown. Defaults to `true`.

### Revane#silent(isSilent: boolean): Revane

If set to `true` no information about the application will be logged during the 
start of the `fastify` server. Defaults to `false`.

### Revane#initialize(): Promise<void>

Initializes the ioc container by creating all beans specified by the configured 
json/xml files. It will perform a component scan, too.<br>


### Revane#getBean(id: string): any

Returns the bean for the `id`. Throws an error if no bean with the `id` is found.

### Revane#port(): string

Returns the port of the `fastify` server.

### Revane#tearDown(): Promise<void>

Closes the `fastify` server and calls `preDestroy()` on each bean.