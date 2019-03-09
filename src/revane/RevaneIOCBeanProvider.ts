import { BeanProvider } from 'revane-fastify'
import RevaneIOC from 'revane-ioc'

export default class RevaneIOCBeanProvicer implements BeanProvider {
  private revaneIOC: RevaneIOC

  constructor (revaneIOC: RevaneIOC) {
    this.revaneIOC = revaneIOC
  }

  get (id: string): any {
    return this.revaneIOC.get(id)
  }

  has (id: string): boolean {
    return this.revaneIOC.has(id)
  }

  getByType (type: string): any[] {
    return this.revaneIOC.getByType(type)
  }
}
