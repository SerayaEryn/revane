# Task Scheduling

*since `3.0.0`*

The scheduling can be enabled by setting the property `revane.scheduling.enabled=true`.

## Creating cron jobs

The `@Scheduled()` decorator allows to create tasks that are being executed on a certain schedule.

Refer to [croner](https://github.com/hexagon/croner?tab=readme-ov-file#pattern) for documentation of the cron patterns.

```ts
import { Component, Scheduled } from 'revane'

@Component
export class SchedulingExample {
  @Scheduled('* */5 * * * *')
  public test () {
    // do something
  }
}
```

## Error Handling

It is possible to customize the error handler for the scheduled task like this:

```ts
import { Component } from 'revane'

@Component
export class SchedulingErrorhandler {
  constructor (taskScheduler: TaskScheduler) {
    taskScheduler.setErrorHandler((error: Error) => {
      console.log(error)
    })
  }
}
```