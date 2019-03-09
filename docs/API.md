# API

## revane(): Revane

Returns a new instance of `Revane`.

## Revane

### Revane#register(id: string): Revane

Registers a fastify plugin with the given `id` at the fastify server.

### Revane#registerControllers(): Revane

Registers all fastify plugins decorated with `@Conroller()` at the fastify server.

### Revane#setErrorHandler(id: string): Revane

Sets a not found handler with the given `id` at the fastify server.

### Revane#setNotFoundHandler(id: string): Revane

Sets an error handler with the given `id` at the fastify server.

### Revane#ready(handler: (err?: Error) => void): Revane

Calls the `handler` once when all plugins have been loaded.

### Revane#basePackage(path: string): Revane

Defines the base package of your application.

### Revane#componentScan(path: string): Revane

Configures a json file that contains bean definintions ([Details](https://github.com/SerayaEryn/revane-ioc#json-file)). 

### Revane#xmlFile(file: string): Revane

Configures a xml file that contains bean definintions ([Details](https://github.com/SerayaEryn/revane-ioc#xml-file)).

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