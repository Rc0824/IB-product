import React, { Component } from 'react';
import {tsConstructorType} from '@babel/types';
import axios from 'axios';
import ImportExcelButton from './ImportExcelButton';
import * as XLSX from 'xlsx';
const API_URL = 'http://localhost:5037/api/IBproduct';
const API_URL2='http://localhost:5037/api/IBproductController2';

export class Product extends Component {

    constructor(props) {
        super(props);
  
        this.state={
          products:[],
          modalTitle:'',
          product_id:0,
          product_name:'',
          product_num:'',
          product_in_freight:'',
          product_out_freight:'',
          product_purchase_price:'',
          product_gross:'',
          product_share:'',
          product_discount:'',
          product_untaxed:'',
        }
      }


    refreshList(){
        axios.get(API_URL)
        .then(response=>response.data)
        .catch(error=>console.log(error))
        .then(data=>{
          this.setState({products:data});
        });
    }

    componentDidMount(){
        this.refreshList();
    }

    handleDownloadClick = () => {
        const { products } = this.state;
    
        const data = products.map((product) => [
          product.product_name,
          product.product_num,
          product.product_purchase_price,
          product.product_in_freight,
          product.product_out_freight,
          product.product_gross,
          product.product_share,
          product.product_discount
        ]);
    
        data.unshift(["品名", "數量", "廠商進價/件","國內運費", "國際運費","毛利率","電商抽成","行銷後扣"]);
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    
        XLSX.writeFile(workbook, "products.xlsx");
      };



      deleteClick(id){
        if(window.confirm('Are you sure?')){
        fetch(API_URL+"/"+id,{
          method:'DELETE',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
          }
        })
        .then(res=>res.json())
        .then((result)=>{
          alert(result);
          this.refreshList();
        },
        (error)=>{
          alert('Failed');
        })}
      }

      editClick(product){
        this.setState({
          modalTitle:'Edit Product',
          product_id:product.product_id,
          product_name:product.product_name,
          product_num:product.product_num,
          product_in_freight:product.product_in_freight,
          product_out_freight:product.product_out_freight,
          product_purchase_price:product.product_purchase_price,
          product_gross:product.product_gross,
          product_share:product.product_share,
          product_discount:product.product_discount
        });
      }



      updateClick(){
        fetch(API_URL,{
          method:'PUT',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            product_id:this.state.product_id,
            product_name:this.state.product_name,
            product_num:this.state.product_num,
            product_in_freight:this.state.product_in_freight,
            product_out_freight:this.state.product_out_freight,
            product_purchase_price:this.state.product_purchase_price,
            product_gross:this.state.product_gross,
            product_share:this.state.product_share,
            product_discount:this.state.product_discount
          })
        })
        .then(res=>res.json())
        .then((result)=>{
          alert(result);
          this.refreshList();
        },
        (error)=>{
          alert('Failed');
        })
      }

      changeName=(e)=>{
        this.setState({product_name:e.target.value});
      }

      changeNum=(e)=>{
        this.setState({product_num:e.target.value});
      }

      changeIn=(e)=>{
        this.setState({product_in_freight:e.target.value});
      }

      changeOut=(e)=>{
        this.setState({product_out_freight:e.target.value});
      }

      changePrice=(e)=>{
        this.setState({product_purchase_price:e.target.value});
      }

      changeGross=(e)=>{
        this.setState({product_gross:e.target.value});
      }

      changeShare=(e)=>{
        this.setState({product_share:e.target.value});
      }

      changeDiscount=(e)=>{
        this.setState({product_discount:e.target.value});
      }

      
      handleInputChange = async (e, product) => {
        const inputValue = parseFloat(e.target.value);
    
        if (isNaN(inputValue) ) {
          alert('請輸入數字');
        }
        else { 
        const cost = product.product_in_freight+product.product_purchase_price*product.product_num+product.product_out_freight*product.product_num;
        const newgross = calculateFinal(cost, inputValue, product.product_discount, product.product_share);
        const newuntaxed = (inputValue*(1-product.product_discount)*(1-product.product_share))/1.1;

        const newProduct = {
          ...product,
          product_untaxed: newuntaxed,
          product_gross: newgross
        };

        const newProducts = this.state.products.map((product) => {
          if (product.product_id === newProduct.product_id) {
            return newProduct;
          }
          return product;
        });

        this.setState({ products: newProducts });
        await axios.put(API_URL, newProduct);
        
      }
      };

      
    
      

    
    render() {
        
        
        const { 
            products,
            modalTitle,
            product_id,
            product_name,
            product_num,
            product_in_freight,
            product_out_freight,
            product_purchase_price,
            product_gross,
            product_share,
            product_discount,
            product_untaxed
          } = this.state;

        return (
          <div>
            <br></br>
            <div style={{ display: 'flex' , justifyContent: 'space-between'}}>
              <ImportExcelButton />
              <button onClick={this.handleDownloadClick}>下載 Excel</button>
            </div>
            <br></br>
            <table className='table table-striped'>
                <thead>
                <tr>
                    <th>品名</th>
                    <th>數量</th>
                    <th>廠商進價/件</th>
                    <th>國內運費</th>
                    <th>國際運費/件</th>
                    <th>廠商進價小計</th>
                    <th>國際運費小計</th>
                    <th>成本總計</th>
                    <th>毛利</th>
                    <th>電商抽成</th>
                    <th>行銷後扣%</th>
                    <th>供貨價</th>
                    <th>未稅</th>
                    <th>件均價</th>
                    <th>團購價</th>
                    <th>件均價(行銷折扣後)</th>
                    <th>團購價(電商售價)</th>
                    <th>件均價(電商售價)</th>
                    <th>淨利</th>
                    <th>淨利/件</th>
                    <th>選項</th>
                </tr>
                </thead>

                <tbody>

                    {products.map(product=>
                    <tr key={product.id}>
                    <td>{product.product_name}</td>
                    <td>{product.product_num}</td>
                    <td style={{backgroundColor:'lightGreen'}}>{product.product_purchase_price }</td>
                    <td style={{backgroundColor:'lightGreen'}}>{product.product_in_freight}</td>
                    <td style={{backgroundColor:'lightGreen'}}>{product.product_out_freight}</td>
                    <td>{product.product_purchase_price*product.product_num}</td>     
                    <td>{product.product_out_freight*product.product_num}</td>
                    <td>{product.product_in_freight+product.product_purchase_price*product.product_num+product.product_out_freight*product.product_num}</td>
                    <td style={{ color: 'red' }}>{product.product_gross*100}%</td>
                    <td style={{ color: 'red' }}>{product.product_share*100}%</td>
                    <td style={{color:'red'}}>{product.product_discount*100}%</td>
                    <td>{(product.product_untaxed*1.1).toFixed(2)}</td>
                    <td>{product.product_untaxed.toFixed(2)} </td>
                    <td>{(product.product_untaxed*1.1/product.product_num).toFixed(2)}</td>
                    <td>{((product.product_untaxed*1.1)/(1-product.product_discount)).toFixed(2)}</td>
                    <td>{((product.product_untaxed*1.1)/(1-product.product_discount)/product.product_num).toFixed(2)}</td>
                    <td style={{color:'red'}}>
                      {Math.ceil(((product.product_untaxed*1.1)/(1-product.product_discount))/(1-product.product_share))}
                      <input
                        type='text'
                        className='form-control'
                        onChange={(e) => this.handleInputChange(e, product)}    
                      />
                      </td>
                    <td>{((product.product_untaxed*1.1)/(1-product_discount)/(1-product.product_share)/product.product_num).toFixed(2)}</td>
                    <td style={{color:'red'}}>{((product.product_untaxed)-(product.product_in_freight+product.product_purchase_price*product.product_num+product.product_out_freight*product.product_num)).toFixed(2)}</td>
                    <td>{(((product.product_untaxed)-(product.product_in_freight+product.product_purchase_price*product.product_num+product.product_out_freight*product.product_num))/product.product_num).toFixed(2)}</td>
                    <td>

                        <button type='button' className='btn btn-primary m-2 ' data-bs-toggle='modal'  data-bs-target='#exampleModal' onClick={()=>this.editClick(product)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>

                        <button className="btn btn-danger"  onClick={()=>this.deleteClick(product.product_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                            </svg>
                        </button>

                    </td>
                    </tr>
                    )}
                </tbody>

        </table>

        <div className='modal fade' id="exampleModal" tableindex="1" aria-hidden="true">
        <div className='modal-dialog modal-lg modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{modalTitle}</h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
        </div>

        <div className='modal-body'>
          <div className='input-group mb-3'>
            <span className='input-group-text'>品名</span>
            <input type='text' className='form-control' value={product_name} onChange={this.changeName}/>
            
          </div>

          <div className='input-group mb-3' >
            <span className='input-group-text'>數量</span>
            <input type='text' className='form-control' value={product_num} onChange={this.changeNum}/>
          </div>

          <div className='input-group mb-3'>
            <span className='input-group-text'>廠商進價/件</span>
            <input type='text' className='form-control' value={product_purchase_price} onChange={this.changePrice}/>
            </div>            


          <div className='input-group mb-3'>
            <span className='input-group-text'>國內運費</span>
            <input type='text' className='form-control' value={product_in_freight} onChange={this.changeIn}/>
          </div>

          <div className='input-group mb-3'>
            <span className='input-group-text'>國際運費</span>
            <input type='text' className='form-control' value={product_out_freight} onChange={this.changeOut}/>
          </div>  
 

          <div className='input-group mb-3'>
              {product_gross !== null ? (
                <>
                  <span className='input-group-text'>毛利率</span>
                  <input type='text' className='form-control' value={product_gross} onChange={this.changeGross} />
                </>
              ) : null}
            
            </div> 

          <div className='input-group mb-3'>
            <span className='input-group-text'>電商抽成</span>
            <input type='text' className='form-control' value={product_share} onChange={this.changeShare}/>
            </div> 


          <div className='input-group mb-3'>
            <span className='input-group-text'>行銷後扣</span>
            <input type='text' className='form-control' value={product_discount} onChange={this.changeDiscount}/>
            </div>
          
          <div style={{ position: 'relative', textAlign: 'right' }}>
            <button type='button' className='btn btn-primary' onClick={() => this.updateClick()}>Update</button>
          </div>

        </div>  


        </div>
        </div>
        </div>



          </div>
          
            

        );
      }

}


function calculateGross(cost,untaxedPrice){
  const gross=(1-cost/untaxedPrice)/1.1;
  return gross.toFixed(2);
}

function calculateFinal(cost,untaxedPrice,discount,share){
  const gross=(1-cost/((untaxedPrice*(1-discount))/(1.1*(1-share))))/1.1;
  return gross.toFixed(2);
}

export default Product;