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
    public class IBproductController2 : ControllerBase
    {

        private readonly IConfiguration _configuration;
        public IBproductController2(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public JsonResult Post2(IB_products Ip)
        {
            string query = @"insert into dbo.product(product_untaxed) values (@product_untaxed)";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("IB_productAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    
                    myCommand.Parameters.AddWithValue("@product_untaxed", Ip.product_untaxed);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Add Success");
        }








    }
}

