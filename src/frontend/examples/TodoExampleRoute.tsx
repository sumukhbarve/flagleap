import React from 'react'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap'
import { buildFlagleapClient } from '../../sdk/sdk-js'
import { makeUseFlag } from '../../sdk/sdk-react'

/// /////////////////////////////////////////////////////////////////////////////
// Setup Flagleap: /////////////////////////////////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

const flagleapClient = buildFlagleapClient({
  instanceUrl: 'http://localhost:3000',
  mode: 'test',
})
const useFlag = makeUseFlag(flagleapClient, React)

/// /////////////////////////////////////////////////////////////////////////////
// State Management: ///////////////////////////////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

interface Todo { id: number, text: string, done: boolean }

interface TodoAppState {
  todos: Todo[]
  showDone: boolean
  setShowDone: (b: boolean) => void
  shownTodos: Todo[]
  toggleTodo: (todoId: number) => void
  addTodo: (text: string) => void
  editText: (todoId: number) => void
}

const SEED_TODOS = [
  'Buy almond milk',
  'Pick clothes from the laundry',
  'Feed the cat',
  'Renew that other subscription',
  'Get the car serviced'
]

const useCreateTodoAppState = function (): TodoAppState {
  const [showDone, setShowDone] = React.useState(true)
  const [todos, setTodos] = React.useState<Todo[]>(SEED_TODOS.map(function (s) {
    return { id: Date.now() + Math.random(), text: s, done: false }
  }))
  const shownTodos = showDone ? todos : todos.filter(todo => !todo.done)

  const toggleTodo = React.useCallback(function (id: number) {
    setTodos(todos.map(function (todo) {
      return id !== todo.id ? todo : { ...todo, done: !todo.done }
    }))
  }, [todos, setTodos])

  const addTodo = React.useCallback(function (text: string) {
    setTodos([...todos, { text, id: Date.now(), done: false }])
  }, [todos, setTodos])

  const editText = React.useCallback(function (id: number) {
    const newText = prompt('Text:')
    setTodos(todos.map(function (todo) {
      return id !== todo.id ? todo : { ...todo, text: newText ?? todo.text }
    }))
  }, [todos, setTodos])

  return {
    todos, showDone, setShowDone, shownTodos, toggleTodo, addTodo, editText
  }
}

const TodoAppContext = React.createContext<TodoAppState | null>(null)
const TodoAppStateProvider: React.FC = function ({ children }) {
  const todoAppState = useCreateTodoAppState()
  return (
    <TodoAppContext.Provider value={todoAppState}>
      {children}
    </TodoAppContext.Provider>
  )
}
const useGetTodoAppState = function (): TodoAppState {
  const todoAppState = React.useContext(TodoAppContext)
  if (todoAppState === null) {
    throw new Error('Unexpected: The Todo Example app has no state?!')
  }
  return todoAppState
}

/// /////////////////////////////////////////////////////////////////////////////
// Components: /////////////////////////////////////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

const TopAlert: React.VFC = function () {
  return (
    <div>
      <Alert variant='primary'>
        This example Todo App uses two feature flags from
        {' '}<i>this</i> instance of FlagLeap, namely
        {' '}<kbd>todoExample_hideCompleted</kbd> and
        {' '}<kbd>todoExample_editTodo</kbd>.
        {' '}If those flags aren't created, it is like they're turned off.
        {' '}To see the flags in action, create them, enable them, and refresh!
      </Alert>
      <hr />
    </div>
  )
}

const Header: React.VFC = function () {
  const { showDone, setShowDone } = useGetTodoAppState()
  const flag = (useFlag('todoExample_hideCompleted'))
  const allowHideCompleted = flag.enabled
  return (
    <header>
      <h4>Todo App <small>(Example)</small></h4>
      {allowHideCompleted && <Form.Check
        id='checkbox-hide-completed'
        label='Hide Completed'
        type='checkbox'
        checked={!showDone}
        onChange={() => setShowDone(!showDone)}
                             />}
      <hr />
    </header>
  )
}

const SingleTodo: React.VFC<{todo: Todo}> = function ({ todo }) {
  const { toggleTodo, editText } = useGetTodoAppState()
  const labelStyle = { textDecoration: todo.done ? 'line-through' : 'initial' }
  const { enabled: allowEditing } = useFlag('todoExample_editTodo')
  const anchorStyle = { display: 'inline-block', marginLeft: 8, fontSize: '75%' }
  return (
    <div className='mb-3'>
      <Form.Check
        id={`todo-${todo.id}`}
        checked={todo.done}
        onChange={() => toggleTodo(todo.id)}
        label={<span style={labelStyle}>{todo.text}</span>}
        style={{ display: 'inline-block' }}
      />
      {allowEditing &&
        <a
          href='#'
          onClick={() => editText(todo.id)}
          style={anchorStyle}
        >Edit
        </a>}
    </div>
  )
}

const TodoList: React.VFC = function () {
  const { shownTodos } = useGetTodoAppState()
  return (
    <div>
      {shownTodos.map(todo => (
        <SingleTodo todo={todo} key={todo.id} />
      ))}
    </div>
  )
}

const TodoAdder: React.VFC = function () {
  const { addTodo } = useGetTodoAppState()
  const [text, setText] = React.useState('')
  const onAdd = React.useCallback(function (evt: React.FormEvent) {
    evt.preventDefault()
    if (text !== '') {
      addTodo(text)
      setText('')
    }
  }, [text, addTodo, setText])
  return (
    <Form onSubmit={onAdd} style={{ maxWidth: 400 }}>
      <InputGroup className='mb-3'>
        <Form.Control
          value={text} placeholder='What needs to be done?'
          onChange={evt => setText(evt.target.value)}
        />
        <Button type='submit' variant='outline-primary'>+ Add</Button>
      </InputGroup>
    </Form>
  )
}

export const TodoExampleRoute: React.VFC = function () {
  return (
    <TodoAppStateProvider>
      <TopAlert />
      <Header />
      <TodoList />
      <TodoAdder />
    </TodoAppStateProvider>
  )
}
