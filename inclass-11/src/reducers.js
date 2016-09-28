
const Reducer = (state =  {
	nextId: 2,
	todoItems: [
	    {id: 0, text: "This is an item", done: false},
	    {id: 1, text: "Another item", done: false}
	]
}, action) => {
	switch(action.type) {
		case 'ADD_TODO':
			// IMPLEMENT ME
			if(typeof(action.text)!='undefined'){
				return {
					nextId: state.nextId + 1,
					todoItems: [...state.todoItems,
					{id: state.nextId,text:action.text,done:false}]
				}
			}else{
				return state
			}
		case 'REMOVE_TODO':
			// IMPLEMENT ME
			
			return {
				nextId: state.nextId,
				todoItems: [...state.todoItems].filter((e)=>{
					return e.id!=action.id})
			}
		case 'TOGGLE_TODO':
			// IMPLEMENT ME
			
			return {
				nextId: state.nextId,
				todoItems:[...state.todoItems].map((e)=>{
					if(e.id == action.id){
						return {id:e.id,text:e.text,done:true}
					}
					return {id:e.id,text:e.text,done:e.done}
				})
			}
		default: 
			return state
	}
}

export default Reducer