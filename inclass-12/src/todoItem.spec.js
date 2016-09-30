import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {findDOMNode} from 'react-dom'
import {expect} from 'chai'
import { ToDos, AddTodo } from './todos'
import { ToDoItem } from './todoItem'

describe('Validate ToDoItem', () => {

	it('should display a single ToDo', () => {
		// use TestUtils.renderIntoDocument
		// findDOMNode and assert 3 children of the ToDoItem element
		// assert the className is ''
		// assert the innerHTML of the todo is the text you initially set

		const _node = TestUtils.renderIntoDocument(<div>< ToDoItem id={1} text="hello" done={false} toggle={_ => _} remove={_ => _}/></div>)
		const node = findDOMNode(_node).children[0]
		expect(node.children.length).to.equal(3)
		expect(node.className).to.equal('')
		expect(node.children[1].innerHTML).to.equal('hello')
	})

	it('should toggle completed when clicked', () => {
		let toggled = false
		// use TestUtils.renderIntoDocument
		// when the checkbox is clicked via TestUtils.Simulate.click()
		// we expect the variable toggled to be true
		const _node = TestUtils.renderIntoDocument(<div>< ToDoItem id={1} text="hello" done={false} toggle={()=>{toggled=true}} remove={_ => _}/></div>)
		const node = findDOMNode(_node).children[0]
		TestUtils.Simulate.click(node.children[0])
		expect(toggled).equal(true)
	})

	it('should remove an item when clicked', () => {
		let removed = false
		const _node = TestUtils.renderIntoDocument(<div>< ToDoItem id={1} text="hello" done={false} toggle={_ => _} remove={()=>{removed=true}} /></div>)
		// use TestUtils.renderIntoDocument
		// when the remove button is clicked via TestUtils.Simulate.click()
		// we expect the variable removed to be true
		const node = findDOMNode(_node).children[0]
		TestUtils.Simulate.click(node.children[2])
		expect(removed).equal(true)
	})

	it('should display a completed ToDo', () => {
		// use TestUtils.renderIntoDocument
		// the item should have done=true
		// assert that the rendered className is "completed"
		const _node = TestUtils.renderIntoDocument(<div>< ToDoItem id={1} text="hello" done={true} toggle={_ => _} remove={_ => _}/></div>)
		const node = findDOMNode(_node).children[0]
		expect(node.children[1].className).equal('completed')
	})

})
