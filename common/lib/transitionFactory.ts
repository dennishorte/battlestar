interface RK {
  put(obj: unknown, key: string, value: unknown): void
  addKey(obj: unknown, key: string, value: unknown): void
  push(arr: unknown[], value: unknown): void
  pop(arr: unknown[]): unknown
  splice(arr: unknown[], start: number, deleteCount: number): void
}

interface GameState {
  rk: RK
}

interface TransitionData {
  initialized?: boolean
  done?: boolean
  stepIndex?: number
  steps?: Step[]
  completedSteps?: string[]
  factory?: {
    stepsRemaining: string[]
  }
  [key: string]: unknown
}

interface TransitionContext {
  state: GameState
  data: TransitionData
  response?: unknown
  push(step: Step, data?: Record<string, unknown>): unknown
  done(): unknown
}

interface Step {
  name: string
  func?: (context: TransitionContext) => unknown
  resp?: (context: TransitionContext) => unknown
}

interface StepFactoryOptions {
  childData?: (context: TransitionContext) => Record<string, unknown>
}

interface TransitionFactory2Options {
  steps: Step[]
  data?: Record<string, unknown>
}

interface PhaseFactoryOptions {
  steps: Step[]
}

type TransitionFunction = (context: TransitionContext) => unknown

function markDone(context: TransitionContext): void {
  const game = context.state
  game.rk.put(context.data, 'done', true)
}

function repeatSteps(count: number, steps: Step[]): Step[] {
  const output: Step[] = []
  for (let i = 0; i < count; i++) {
    for (const step of steps) {
      const copy = Object.assign({}, step)
      copy.name += i
      output.push(copy)
    }
  }
  return output
}

function stepFactory(steps: Step[], options?: StepFactoryOptions): TransitionFunction {
  options = options || {}

  return function(context: TransitionContext): unknown {
    _initialize(context, { steps, stepIndex: 0 })

    const game = context.state

    if (context.data.stepIndex! < context.data.steps!.length) {
      const step = context.data.steps![context.data.stepIndex!]
      game.rk.put(context.data, 'stepIndex', context.data.stepIndex! + 1)

      let childData: Record<string, unknown> = {}
      if (options!.childData) {
        childData = options!.childData(context)
      }

      return context.push(step, childData)
    }
    else {
      return context.done()
    }
  }
}

function transitionFactory(
  data: Record<string, unknown>,
  generator: (context: TransitionContext) => unknown,
  responder: (context: TransitionContext) => unknown
): TransitionFunction {
  return function (context: TransitionContext): unknown {
    _initialize(context, data)

    if (context.data.done) {
      return context.done()
    }

    else if (context.response) {
      return responder(context)
    }

    else {
      return generator(context)
    }
  }
}

function _initialize(context: TransitionContext, data: Record<string, unknown>): void {
  if (context.data.initialized) {
    return
  }

  const game = context.state
  game.rk.addKey(context.data, 'initialized', true)

  // Often used by transition to show they have no more work, and are just waiting for
  // child transitions to complete.
  game.rk.addKey(context.data, 'done', false)

  for (const [key, value] of Object.entries(data)) {
    game.rk.addKey(context.data, key, value)
  }
}

function transitionFactory2(options: TransitionFactory2Options): TransitionFunction {
  return function(context: TransitionContext): unknown {
    _initialize2(context, options)

    const game = context.state

    // If a transition sometimes wants to short-circuit itself and finish before going
    // through all of its steps, it can set this flag on the context to exit early.
    if (context.data.done) {
      return context.done()
    }

    if (context.response) {
      const step = _nextStep(context, options)

      game.rk.push(context.data.completedSteps!, step!.name)

      const result = options.steps.find(s => s.name === step!.name)!.resp!(context)

      // If a result was returned, that means that the response handler set up the next
      // transition in the statemachine, and we should break here. Otherwise, continue on to
      // the next step in this transition.
      if (result) {
        return result
      }
    }

    // Go through all the steps until the first step that hasn't been completed, and
    // execute that step. If that step returns a value, that means it has set up the
    // next transition. Otherwise, continue going through the steps of this transition.
    for (const step of options.steps) {
      if (context.data.completedSteps!.includes(step.name)) {
        continue
      }
      else {
        game.rk.push(context.data.completedSteps!, step.name)

        const result = step.func!(context)
        if (result === 'wait') {
          // Make sure that if we call this again before getting a response,
          // we don't just skip over the wait.
          game.rk.pop(context.data.completedSteps!)
        }

        if (result) {
          return result
        }
        else {
          continue
        }
      }
    }

    // Once all steps have been completed, this transition is finished.
    return context.done()
  }
}

function _nextStep(context: TransitionContext, options: TransitionFactory2Options): Step | undefined {
  for (const step of options.steps) {
    if (!context.data.completedSteps!.includes(step.name)) {
      return step
    }
  }
}

function _initialize2(context: TransitionContext, options: TransitionFactory2Options): void {
  if (context.data.initialized) {
    return
  }

  const game = context.state

  game.rk.addKey(context.data, 'initialized', true)
  game.rk.addKey(context.data, 'done', false)
  game.rk.addKey(context.data, 'completedSteps', [])

  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      game.rk.addKey(context.data, key, value)
    }
  }
}

/*
   Phase factory is composed of a series of steps. Unlike transitionFactory2, those steps
   each repeat until they explicitly call nextPhase.
 */
function phaseFactory(options: PhaseFactoryOptions): TransitionFunction {
  return function(context: TransitionContext): unknown {
    const { rk } = context.state

    // Initialize internal state the first time this is called.
    if (!context.data.factory) {
      rk.addKey(context.data, 'factory', {
        stepsRemaining: options.steps.map(s => s.name)
      })
    }

    while (context.data.factory!.stepsRemaining.length > 0) {
      const nextStepName = context.data.factory!.stepsRemaining[0]
      const func = options.steps.find(s => s.name === nextStepName)!.func!
      const result = func(context)
      if (result) {
        return result
      }
      else {
        continue
      }
    }

    return context.done()
  }
}

function nextPhase(context: TransitionContext): void {
  if (!context.data.factory) {
    throw new Error('This transition is not set up for using nextPhase')
  }
  if (!context.data.factory.stepsRemaining) {
    throw new Error('This transition is missing the next steps data')
  }

  const { rk } = context.state
  rk.splice(context.data.factory.stepsRemaining, 0, 1)
}

export {
  markDone,
  nextPhase,
  phaseFactory,
  repeatSteps,
  stepFactory,
  transitionFactory,
  transitionFactory2,
  TransitionContext,
  TransitionData,
  Step,
  TransitionFunction,
}
