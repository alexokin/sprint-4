
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import { boardService } from './board.service.local.js'

const STORAGE_KEY = 'board'

export const groupService = {
    query,
    getById,
    save,
    remove,
    getEmptyGroup,
}

window.cs = groupService

async function query(boardId) {
    try {
        const board = await storageService.get(STORAGE_KEY, boardId)
        return board.groups
    } catch (err) {
        throw err
    }
}

async function getById(boardId, groupId) {
    try {
        const board = await storageService.get(STORAGE_KEY, boardId)
        const group = board.groups.find(group => group._id === groupId)
        return group
    } catch (err) {
        throw err
    }
}

async function remove(boardId, groupId) {
    // throw new Error('Nope')
    try {
        const board = await storageService.get(STORAGE_KEY, boardId)
        board.groups = board.groups.filter(group => group._id !== groupId)
        await storageService.put(STORAGE_KEY, board)
    } catch (err) {
        throw err
    }
}

async function save(boardId, group) {
    try {
        const board = await boardService.getById(boardId)
        if (group._id) {
            board.groups = board.groups.map(currGroup => (currGroup._id === group._id) ? group : currGroup)
        } else {
            // Later, owner is set by the backend
            //group.createdBy = userService.getLoggedinUser()
            group._id = utilService.makeId()
            board.groups.push(group)
        }
        await storageService.put(STORAGE_KEY, board)
        return group
    } catch (err) {
        throw err
    }

}

function getEmptyGroup() {
    return {
        title: '',
        archivedAt: '',
        style: {},
        tasks: []
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))



