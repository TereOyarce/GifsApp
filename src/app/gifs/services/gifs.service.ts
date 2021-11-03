import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gif.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'RK9pGyl6VpqFMRsDEqFrLQSGpjA6BARs';
  private urlService : string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }
//Realizar peticiones http en base a  observables, y guardar el historial al actualizar
  constructor(private http: HttpClient) {
   this._historial= JSON.parse(localStorage.getItem('historial')!) || []
   this.resultados = JSON.parse(localStorage.getItem('resultados')!) || []
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.slice(0, 10);

      //Almacenar la data que buscamos
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    //Paramatros para refactorizar url de api
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '20')
    .set('q', query)
    console.log(params.toString());



    this.http
      .get<SearchGifsResponse>(`${this.urlService}/search`,{params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados',JSON.stringify(this.resultados));

      });

    console.log(this._historial);
  }
}
