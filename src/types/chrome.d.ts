declare namespace chrome {
  namespace userScripts {
    interface UserScriptFilter {
      ids?: string[]
    }

    interface RegisteredUserScript {
      id: string
      matches: string[]
      js: {code: string}[]
      world?: 'ISOLATED' | 'MAIN'
      runAt?: 'document_start' | 'document_end' | 'document_idle'
      allFrames?: boolean
      persistAcrossSessions?: boolean
      cssOrigin?: 'AUTHOR' | 'USER'
      injectImmediately?: boolean
    }

    interface WorldOptions {
      name?: string
      messaging?: boolean
      injectionMode?: 'MAIN_WORLD' | 'ISOLATED_WORLD'
    }

    function register(scripts: RegisteredUserScript[]): Promise<void>
    function unregister(filter: UserScriptFilter): Promise<void>
    function getScripts(): Promise<RegisteredUserScript[]>
    function configureWorld(options: WorldOptions): Promise<void>
  }
}
