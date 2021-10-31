import { DlduData } from './types'

const DataService = {
  fetchData: () : DlduData => {
    return {
      levels: [
        {
          name: 'Undead Burg',
          bosses: [
            {
              name: 'Asylum Demon',
              points: 5,
              beaten: true
            },
            {
              name: 'Stray Demon',
              points: 5,
              beaten: false
            },
            {
              name: 'Black Knight 1',
              points: 3,
              beaten: false
            }
          ]
        },
        {
          name: 'Anor Londo',
          bosses: [
            {
              name: 'Gwyndolin',
              points: 5,
              beaten: false
            },
            {
              name: 'Channeler',
              points: 3,
              beaten: false
            }
          ]
        }
      ]
    }
  }
}

export default DataService
