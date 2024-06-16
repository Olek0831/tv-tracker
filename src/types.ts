interface Show{
  id: number,
  name: string,
  type: string,
  language: string,
  genres?: Array<string>,
  officialSite: string,
  status: string,
  summary?: string,
  network: {
    name: string
    country: {
      name: string
    }
  }
  image?: {
    medium: string
  }
  rating?: {
    average: number
  }
}

interface SearchedShow{
  show: Show
}

interface Episode {
  id: number,
  season: number,
  number: number,
  airdate: string,
  airtime?: string,
  name: string,
  runtime?: number,
  summary?: string,
  image?: {
    medium: string
  }
}

interface EpisodeWithShow extends Episode{
  show: Show
}

interface ShowWithEpisodes extends Show{
  _embedded: {
    episodes: Array<Episode>
  }
}

interface Info{
  name: string,
  image: JSX.Element,
  header: string,
  country: JSX.Element,
  network: JSX.Element,
  statusOrNumber: JSX.Element,
  typeOrAirdate: JSX.Element,
  genres?: Array<string>,
  airtime?: JSX.Element,
  ratingOrRuntime: JSX.Element | string,
  description: JSX.Element | string
}

interface MainProps {
  currentState: string,
  stateList: Array<string>, 
  toSearch: string, 
  moreShows: ()=>void,
  ID: number,
  season?: number,
  episodeID?: number,
  details:(id: number, season?: number, episodeID?: number) => void
}

interface BannerProps {
  onClick:(i:number)=>void,
  searchValue: string, 
  onChange:(e: React.ChangeEvent<HTMLInputElement>) => void,
  onKeyDown:(e: React.KeyboardEvent<HTMLInputElement>) => void
};

interface FilterProps {
  genre: string,
  type: string,
  status: string,
  language: string,
  country: string,
  onGenreChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>)=>void,
  onClick: ()=>void,
  onClr: ()=>void
}

interface LoaderProps {
  loading: boolean,
  showsToShow: Array<Show>,
  showsPage: number,
  buttons: number,
  handlePagination: (i: number)=>void,
  onNext: ()=>void,
  onPrev: ()=>void,
  details: (id: number)=>void
}