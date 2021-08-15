
import React, { Component } from 'react'
import { getMovies } from './getMovies'   // normal import
import axios from 'axios';  // for request(promisified)    
export default class Movies extends Component {
    constructor()      // making class == sytnax strats..
    {
        super();
        this.state = {
            movies: [],  // movies from backend
            currSearchText: '',
            currPage: 1,
            limit:4,
            genres: [{ _id: 'abcd', name: 'All Genres' }],
            cGenre: 'All Genres'
        }
    }
     // backend data = > movie array   
    async componentDidMount(){     // promise
        // console.log('Component DID Mount');
        let res = await axios.get('https://backend-react-movie.herokuapp.com/movies');
        // console.log(res);
        let genreRes = await axios.get('https://backend-react-movie.herokuapp.com/genres');
        // console.log(res.data.movies);
        console.log(genreRes.data.genres);
        this.setState({
            movies:res.data.movies,
            genres: [...this.state.genres, ...genreRes.data.genres]
        })
    }
 

    // to detect change
    handleChange = (e) => {
        let val = e.target.value;
        this.setState({
            currSearchText: val
        })
    }
    
      // genre state
    handleGenreChange=(genre)=>{
        this.setState({
            cGenre:genre
        })
    }


    // function to delete movie on UI
    onDelete = (id) => {

        let arr = this.state.movies.filter(function (movieObj) {
            return movieObj._id != id; // return only when our selected id is not matched
        })
        this.setState({  // if state changed then it re-rendered...bascially to change shows on UI
            movies: arr,
        })
    }

    // to sort on basis of rate
    sortByRatings= (e)=>{
        let className = e.target.className;
        console.log(className);
        let sortedMovies=[];
        if(className=='fa fa-sort-asc')
        {
            //ascending order
            sortedMovies = this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjA.dailyRentalRate-movieObjB.dailyRentalRate
            })
        }
        else
        {
            //descending order
            sortedMovies =this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjB.dailyRentalRate-movieObjA.dailyRentalRate
            })
        }
        this.setState({
            movies:sortedMovies
        })
    }
  // to sort on basisi of stocks
    sortByStocks= (e)=>{
        let className = e.target.className;
        console.log(className);
        let sortedMovies=[];
        if(className=='fa fa-sort-asc')
        {
            //ascending order
            sortedMovies = this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjA.numberInStock-movieObjB.numberInStock
            })
        }
        else
        {
            //descending order
            sortedMovies =this.state.movies.sort(function(movieObjA,movieObjB){
                return movieObjB.numberInStock-movieObjA.numberInStock
            })
        }
        this.setState({
            movies:sortedMovies
        })
    }


    handlePageChange = (pageNumber) => {
        this.setState({ currPage: pageNumber });
    }

    // limit update 
     limitupdate = (e) => {
           
         let className = e.target.className;
        
         if(className=='fa fa-sort-desc'){
            this.setState({
                   limit: this.state.limit + 1,
                  })
         }else{
            this.setState({
                limit: this.state.limit - 1,
               })
         }
        

     }



    render() {
        let { movies, currSearchText,currPage,limit,genres,cGenre} = this.state;  // destructuring; (our state contains tow obj 1:movies ,2: currSearchText)
        // let limit = 4;
        let filteredArr = [];
        if (currSearchText == '') {
            filteredArr = movies;
        } else {
            // .includes ic case senstive.
            filteredArr = movies.filter(function (moviesObj) {
                let title = moviesObj.title.toLocaleLowerCase();// lower-casing the recieved title
                return title.includes(currSearchText.toLocaleLowerCase());
            })
        }
         
        // genre click
        if(cGenre!='All Genres')
        {
            filteredArr = filteredArr.filter(function(movieObj){
                return movieObj.genre.name==cGenre
            })
        }
           
       // page required on screen
        let numberofPage = Math.ceil(filteredArr.length / limit);
        let pageNumberArr = [];
        for (let i = 0; i < numberofPage; i++) {
            pageNumberArr.push(i + 1);
        }
        let si = (currPage - 1) * limit;
        let ei = si + limit;
        filteredArr = filteredArr.slice(si, ei);




        return (
            //JSX
            <>
            {this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> :
            <div className='container'>{/* remove extramargin simply remove scrollbar so our code is inside div of container */}
                <div className='row'>
                    <div className='col-3'>{/* 3-width or 25%*/}
                    <ul className="list-group">
                                 {
                                     genres.map((genreObj)=>(
                                         <li onClick={()=>this.handleGenreChange(genreObj.name)} key={genreObj._id} className='list-group-item'>
                                             {genreObj.name}
                                         </li>
                                     ))
                                 }
                                </ul>
                                <h5>Current Genre : {cGenre}</h5>
                            </div>
                    <div className='col-9'>{/* 9-width or 75%*/}
                        <input type='search' value={this.state.currSearchText}
                            onChange={this.handleChange}>
                        </input>

                        <input type='search' value={this.state.limit}
                            onChange={this.handleChange}>
                        </input><i onClick={this.limitupdate} className="fa fa-sort-asc" aria-hidden="true"></i><i onClick={this.limitupdate} className="fa fa-sort-desc" aria-hidden="true"></i>
                        <table className="table">
                            <thead>
                                <tr>{/* headings of columns*/}
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Genre</th>
                                    <th scope="col"><i onClick={this.sortByStocks} className="fa fa-sort-asc" aria-hidden="true"></i>
                                        Stocks<i onClick={this.sortByStocks}className="fa fa-sort-desc" aria-hidden="true"></i>
                                        </th>
                                    <th scope="col"><i onClick={this.sortByRatings} className="fa fa-sort-asc" aria-hidden="true"></i>
                                        Rate<i onClick={this.sortByRatings} className="fa fa-sort-desc" aria-hidden="true"></i>
                                        </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredArr.map((movieObj) => {// to load movies in rowS
                                        return (
                                            <tr key={movieObj._id}>{/* providing diff. id to each row so reAct can differntiate b/w each row*/}
                                                <td></td>
                                                <td>{movieObj.title}</td>
                                                <td>{movieObj.genre.name}</td>
                                                <td>{movieObj.numberInStock}</td>
                                                <td>{movieObj.dailyRentalRate}</td>
                                                <td><button onClick={() => {
                                                    this.onDelete(movieObj._id)// we are sending id so that it can compare it and delete it
                                                }} type="button" className="btn btn-danger">Delete</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <nav aria-label="...">
                            <ul className="pagination">
                                {
                                    pageNumberArr.map((pageNumber) => {
                                        let classStyle = pageNumber == currPage ? 'page-item active' : 'page-item';
                                        return (
                                            <li key={pageNumber} onClick={() => this.handlePageChange(pageNumber)} className={classStyle}><span className="page-link">{pageNumber}</span></li>
                                        )
                                    })
                                }
                            </ul>
                        </nav>
                    </div>
                </div>

            </div>
                }
                </>
        )
    }
}



{/* <li className="page-item"><a class="page-link" href="#">1</a></li>
    <li className="page-item active" aria-current="page">
      <a className="page-link" href="#">2</a>
    </li>
    <li className="page-item"><a class="page-link" href="#">3</a></li> */}