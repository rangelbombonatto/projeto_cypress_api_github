/// <reference types="Cypress"/>

describe('Testes na API do Github', () => {

    let testData;
    const urlbase = cy.config().baseUrl
    const ownerGit = Cypress.env('ownerGit') 

    before(() => {
        cy.fixture('dados').then(t => {
            testData = t 
        })
    })

    it('Deve cadastrar um repositório no Github', () => {
        cy.request({
            url: urlbase + '/user/repos',
            method: 'POST',
            body: testData.dadosNovoRepositorio,
            headers: {
                Authorization: Cypress.env('token')
            }
        }).then(response => {
            expect(response.status).to.eq(201)
            expect(response.body.name).to.eq(testData.dadosNovoRepositorio.name)
            expect(response.body.description).to.eq(testData.dadosNovoRepositorio.description)
            expect(response.body.visibility).to.eq('public')
            expect(response.body.is_template).to.be.true
        })
    })

    it('Deve consultar um repositório especifico no Github', () => {
        cy.request({
            method: 'GET',
            url: `${urlbase}/repos/${ownerGit}/${testData.dadosNovoRepositorio.name}`,
            headers: {
                Authorization: Cypress.env('token') 
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.name).to.eq(testData.dadosNovoRepositorio.name)
            expect(response.body.description).to.eq(testData.dadosNovoRepositorio.description)
            expect(response.body.visibility).to.eq('public')
            expect(response.body.is_template).to.be.true
            expect(response.body.owner.login).to.eq(ownerGit)

        })
    })

    it('Deve criar uma issue para o repositório', () => {
        cy.request({
            method: 'POST',
            url: `${urlbase}/repos/${ownerGit}/${testData.dadosNovoRepositorio.name}/issues`,
            headers: {
                Authorization: Cypress.env('token') 
            },
            body: testData.dadosNovaIssue
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.title).to.eq(testData.dadosNovaIssue.title)
            expect(response.body.user.login).to.eq(ownerGit)
            expect(response.body.labels[0].name).to.eq(testData.dadosNovaIssue.labels[0])
            expect(response.body.state).to.eq('open')
            expect(response.body.locked).to.be.false
            expect(response.body.assignee).to.be.null
            expect(response.body.body).to.eq(testData.dadosNovaIssue.body)
        })
    })

    it('Deve consultar uma issue do repositório criado', () => {
        cy.request({
            method: 'GET',
            url: `${urlbase}/repos/${ownerGit}/${testData.dadosNovoRepositorio.name}/issues/1`,
            headers: {
                Authorization: Cypress.env('token') 
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.title).to.eq(testData.dadosNovaIssue.title)
            expect(response.body.user.login).to.eq(ownerGit)
            expect(response.body.labels[0].name).to.eq(testData.dadosNovaIssue.labels[0])
            expect(response.body.state).to.eq('open')
            expect(response.body.locked).to.be.false
            expect(response.body.assignee).to.be.null
            expect(response.body.comments).to.eq(0);
        })
    })

    it('Deve deletar um repositório no Github', () => {
        cy.request({
            method: 'DELETE',
            url:  `${urlbase}/repos/${ownerGit}/${testData.dadosNovoRepositorio.name}`,
            headers: {
                Authorization:  Cypress.env('token')
            }
        }).then((response) => {
            expect(response.status).to.equal(204)
            expect(response.body).to.be.empty
        })
    })

    it('Deve retornar repositório não encontrado', () => {
        cy.request({
            method: 'DELETE',
            url: `${urlbase}/${ownerGit}/${testData.dadosNovoRepositorio.name}`,
            headers: {
                Authorization: Cypress.env('token')
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(404)
            expect(response.body.message).to.eq(testData.dadosRepoNotFound.message)
            expect(response.body.documentation_url).to.eq(testData.dadosRepoNotFound.documentation_url)
        })
    })

})