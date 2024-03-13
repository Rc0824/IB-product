namespace IB_product.Models
{
    public class IB_products
    {
        public int product_id { get; set; }

        public string product_name { get; set; }

        public int product_num { get; set; }

        public int product_in_freight { get; set; }

        public  int product_out_freight {get; set; }

        public int product_purchase_price { get; set; }

        public double product_gross { get; set;}

        public double product_share { get; set;}


        public double product_discount { get;set; }


        public double product_untaxed { get; set; }
    }
}
