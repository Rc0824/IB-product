using IB_product.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Serialization;
using System.Data;
using System.Data.SqlClient;

namespace IB_product.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IBproductController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        public IBproductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select * from dbo.product";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("IB_productAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }


        [HttpPost]
        public JsonResult Post(List<List<string>> excelData)
        {
            string query = @"insert into dbo.product(product_name,product_num,product_purchase_price,product_in_freight,product_out_freight,product_gross,product_share,product_discount,product_untaxed) values (@product_name,@product_num,@product_purchase_price,@product_in_freight,@product_out_freight,@product_gross,@product_share,@product_discount,@product_untaxed)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("IB_productAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {

                foreach (var rowData in excelData)
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        
                        myCommand.Parameters.AddWithValue("@product_name", rowData[0]);
                        myCommand.Parameters.AddWithValue("@product_num", int.Parse(rowData[1]));
                        myCommand.Parameters.AddWithValue("@product_purchase_price", int.Parse(rowData[2]));
                        myCommand.Parameters.AddWithValue("@product_in_freight", int.Parse(rowData[3]));
                        myCommand.Parameters.AddWithValue("@product_out_freight", int.Parse(rowData[4]));
                        myCommand.Parameters.AddWithValue("@product_gross", double.Parse(rowData[5]));
                        myCommand.Parameters.AddWithValue("@product_share", double.Parse(rowData[6]));
                        myCommand.Parameters.AddWithValue("@product_discount", double.Parse(rowData[7]));

                        double productUntaxed = Math.Ceiling((double.Parse(rowData[3]) + int.Parse(rowData[2]) * int.Parse(rowData[1]) + int.Parse(rowData[4]) * int.Parse(rowData[1])) / (1 - double.Parse(rowData[5]) * 1.1));
                        myCommand.Parameters.AddWithValue("@product_untaxed", productUntaxed);

                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
            }
            return new JsonResult("Add Successfully");
        }
      


        [HttpPut]
        public JsonResult Put(IB_products Ip)
        {
            string query = @"update dbo.product set product_name= @product_name , product_num= @product_num,  product_purchase_price=@product_purchase_price, product_in_freight= @product_in_freight, product_out_freight= @product_out_freight , product_gross=@product_gross, product_share=@product_share, product_discount=@product_discount , product_untaxed=@product_untaxed where product_id  = @product_id";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("IB_productAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    double productedUntaxed = Math.Ceiling((Ip.product_in_freight+Ip.product_out_freight*Ip.product_num+Ip.product_purchase_price*Ip.product_num)/(1-Ip.product_gross*1.1));
                    myCommand.Parameters.AddWithValue("@product_id", Ip.product_id);
                    myCommand.Parameters.AddWithValue("@product_name", Ip.product_name);
                    myCommand.Parameters.AddWithValue("@product_num", Ip.product_num);
                    myCommand.Parameters.AddWithValue("@product_purchase_price", Ip.product_purchase_price);
                    myCommand.Parameters.AddWithValue("@product_in_freight", Ip.product_in_freight);
                    myCommand.Parameters.AddWithValue("@product_out_freight", Ip.product_out_freight);
                    myCommand.Parameters.AddWithValue("@product_gross", Ip.product_gross);
                    myCommand.Parameters.AddWithValue("@product_share", Ip.product_share);
                    myCommand.Parameters.AddWithValue("@product_discount", Ip.product_discount);
                    myCommand.Parameters.AddWithValue("@product_untaxed", productedUntaxed);

                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Update Success");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.product where product_id=@product_id";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("IB_productAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@product_id", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Delete Success");
        }








    }
}
