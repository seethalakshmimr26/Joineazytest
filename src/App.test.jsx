// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import App from './App'
import { AppProvider } from './context/AppContext'

const mount = () => render(<AppProvider><App /></AppProvider>)

beforeEach(() => localStorage.clear())
afterEach(cleanup)

async function loginAs(name) {
  await screen.findByText('Pick who you want to be')
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }))
}

describe('student flow', () => {
  it('shows only their assignments and progress', async () => {
    mount()
    await loginAs('Anjali Das')
    expect(await screen.findByText('3 of 5 submitted')).toBeTruthy()
    // as5 (Wireshark) is not assigned to Anjali
    expect(screen.queryByText('Networks: Wireshark Packet Analysis')).toBeNull()
  })

  it('needs a final confirmation before marking submitted', async () => {
    mount()
    await loginAs('Anjali Das')
    await screen.findByText('3 of 5 submitted')

    fireEvent.click(screen.getByRole('button', { name: /Yes, I have submitted Algorithms: Dynamic Programming/ }))
    const dialog = await screen.findByRole('dialog')
    // Not submitted yet: only the first step happened
    expect(screen.getByText('3 of 5 submitted')).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Confirm submission' }))
    expect(await screen.findByText('4 of 5 submitted')).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('keeps the submission after a reload', async () => {
    const first = mount()
    await loginAs('Anjali Das')
    await screen.findByText('3 of 5 submitted')
    fireEvent.click(screen.getByRole('button', { name: /Yes, I have submitted Web Technologies: Portfolio/ }))
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Confirm submission' }))
    await screen.findByText('4 of 5 submitted')
    first.unmount()

    mount() // simulates a page refresh: same localStorage, fresh app
    expect(await screen.findByText('4 of 5 submitted')).toBeTruthy()
  })
})

describe('admin flow', () => {
  it('shows only assignments the professor created', async () => {
    mount()
    await loginAs('Prof. Meera Nair')
    expect(await screen.findByRole('heading', { name: 'Operating Systems: Scheduling Simulation' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Databases: ER Diagram for a Library' })).toBeNull() // created by Prof. Arjun
  })

  it('creates and deletes an assignment', async () => {
    mount()
    await loginAs('Prof. Meera Nair')
    await screen.findByText('Your assignments')

    fireEvent.click(screen.getByRole('button', { name: 'New assignment' }))
    const form = await screen.findByRole('dialog')
    fireEvent.click(within(form).getByRole('button', { name: 'Create assignment' }))
    expect(within(form).getByText('Enter a title.')).toBeTruthy() // validation blocks empty form

    fireEvent.change(within(form).getByLabelText('Title'), { target: { value: 'Test Assignment' } })
    fireEvent.change(within(form).getByLabelText('Description'), { target: { value: 'Short description' } })
    fireEvent.change(within(form).getByLabelText('Due date and time'), { target: { value: '2030-01-01T10:00' } })
    fireEvent.change(within(form).getByLabelText('Drive link for submission'), { target: { value: 'https://drive.google.com/x' } })
    fireEvent.click(within(form).getByRole('button', { name: 'Create assignment' }))
    expect(await screen.findByRole('heading', { name: 'Test Assignment' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Delete Test Assignment/ }))
    fireEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Delete assignment' }))
    expect(screen.queryByRole('heading', { name: 'Test Assignment' })).toBeNull()
  })
})
