import BeanResolverRegistry from './BeanResolverRegistry'
import Options from './Options'
import ComponentScanResolver from './resolvers/ComponentScanResolver'
import JsonFileResolver from './resolvers/JsonFileResolver'
import XmlFileResolver from './resolvers/XmlFileResolver'
import UnknownEndingError from './UnknownEndingError'

const fileResolvers = {
  '.json': JsonFileResolver,
  '.xml': XmlFileResolver
}
const supportedFileEndings = [
  '.json',
  '.xml'
]

function getBeanDefinitions (options: Options) {
  try {
    const beanResolverRegistry = getBeanResolverRegistry(options)
    return beanResolverRegistry.get()
  } catch (err) {
    return Promise.reject(err)
  }
}

function getBeanResolverRegistry (options: Options) {
  const files = options.configurationFiles || []
  const beanResolverRegistry = new BeanResolverRegistry()
  for (const file of files) {
    beanResolverRegistry.register(getResolver(file))
  }
  if (options.componentScan !== false) {
    beanResolverRegistry.register(new ComponentScanResolver(options))
  }
  return beanResolverRegistry
}

function getResolver (file) {
  const ending = getEnding(file)
  return new fileResolvers[ending](file)
}

function getEnding (file: string): string {
  for (const ending of supportedFileEndings) {
    if (file.endsWith(ending)) {
      return ending
    }
  }
  throw new UnknownEndingError()
}

export default { getBeanDefinitions }
