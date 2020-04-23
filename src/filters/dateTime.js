import format from 'date-fns/format'

export default date => format(new Date(date), `yyyy-MM-dd HH:mm`)
