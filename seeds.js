const faker = require('faker')
const { hash } = require("bcryptjs")

const User = require('./src/app/models/User')
const File = require('./src/app/models/file')
const Chef = require('./src/app/models/chef')
const Recipe = require('./src/app/models/recipe')
const RecipeFile = require('./src/app/models/recipeFile')


async function createUsers() {
    console.log('createUsers() has been called')

    let users = []

    while (users.length < 3) {
        let is_admin

        if (users.length == 0) {
            is_admin = true
        } else {
            is_admin = false
        }

        let user = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            password: '1111',
            email: faker.internet.email(),
            is_admin: is_admin
        }

        users.push(user)

    } 

    const usersPromises = users.map( user => User.create(user) )
    const usersIds = await Promise.all(usersPromises)

    return usersIds
}


async function createChefs() {
    console.log('createChefs() has been called')

    let chefsIds = []

    while (chefsIds.length < 3) {
        let fileResult = await File.create(
            {
                filename: 'placeholder',
                path: '/sample/path',
                src: 'https://place-hold.it/200x200.gif'
            })

        let fileId = fileResult.rows[0].id

        let chefResult = await Chef.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            imageId: fileId
        })

        let chefId = chefResult.rows[0].id

        chefsIds.push(chefId)
    }

    return chefsIds

} 


async function createRecipes(usersIds, chefsIds) {
    console.log('createRecipes() has been called')

    console.log('usersIds in createRecipes()')
    console.log(usersIds)

    console.log('chefsIds in createRecipes()')
    console.log(chefsIds)

    let files = []

    while (files.length < 6) {
        files.push({
                filename: 'placeholder',
                path: '/sample/path',
                src: 'https://place-hold.it/200x200.gif'
        })
    }

    const filesPromises = files.map( file => File.create(file) )
    const filesPromisesResults = await Promise.all(filesPromises)
    const filesIds = filesPromisesResults.map(result => result.rows[0].id )

    console.log('filesIds')
    console.log(filesIds)

    let recipes = []

    while (recipes.length < 3) {
        recipes.push({
            title: faker.lorem.sentence(3),
            ingredients: [faker.lorem.sentence(5), faker.lorem.sentence(5)],
            preparation: [faker.lorem.sentence(10), faker.lorem.sentence(20)],
            information: faker.lorem.paragraph(3),
            chef: faker.random.arrayElement(chefsIds),
        })
    }

    const recipesPromises = recipes.map(
        recipe => Recipe.create(recipe, faker.random.arrayElement(usersIds))
    ) 

    let recipesResults = await Promise.all(recipesPromises)
    let recipesIds = recipesResults.map(result => result.rows[0].id)
    
    console.log('recipesIds')
    console.log(recipesIds)

    // filesIds has length 6
    // recipesIds has length 3

    for (let i = 0; i< filesIds.length; i++) {
        let fileId = filesIds[i]
        let recipeId = recipesIds[Math.floor(i/2)]

        await RecipeFile.create({recipe_id:recipeId, file_id: fileId})
    }


} 


(async () => {

    let usersIds = await createUsers()
    console.log('usersIds')
    console.log(usersIds)


    let chefsIds = await createChefs()
    console.log('chefsIds')
    console.log(chefsIds)

    createRecipes(usersIds, chefsIds)

})();



