const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('lodash')

const port = 3001
const cursos = require('./cursos.json')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/cursos', (req, resp) => {
    const filterName = req.query.q ? req.query.q.toLowerCase() : ''
    const filterDuration = req.query.d ? req.query.d.toLowerCase() : ''
    const filterStart = req.query.s ? req.query.s.toLowerCase() : ''

    cursosWithFilter = cursos.filter(curso => {
        const name = curso.name.toLowerCase()
        const description = curso.description.toLowerCase()
        const duration = curso.duration.toLowerCase()
        const start = curso.start.toLowerCase()
        
        if((name.indexOf(filterName) >= 0 || description.indexOf(filterName) >= 0) && duration.indexOf(filterDuration) >= 0 && start.indexOf(filterStart) >= 0 ){
            return true
        }
        else {
            return false
        }
    })

    let durations = _.uniq(cursosWithFilter.map(curso => curso.duration))
    let starts = _.uniq(cursos.map(curso => curso.start))
    durations = durations.map(duration => {
        const durationSplit = duration.split(' ')
        return {time: Number(durationSplit[0]), posFix: durationSplit[1]}
    })
    durations.sort((a, b) => {
        return a.time - b.time
    })

    const meses = []
    const horas = []
    const outhers = []
    durations.forEach(duration => {
        const posFix = duration.posFix.toLowerCase()
        if(posFix == 'meses' || posFix == 'mês' || posFix == 'mes'){
            meses.push(duration)
        }else if(posFix == 'horas' || posFix == 'hora'){
            horas.push(duration)
        }else{
            outhers.push(duration)
        }
    })

    resp.json({ cursos: cursosWithFilter, durations: {meses: meses, horas: horas, outhers: outhers}, starts})
})

app.listen(port, () => {
    console.log('Servidor rodando na porta: ' + port)
})