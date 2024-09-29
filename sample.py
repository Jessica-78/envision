
quantity=int(input("enter the quantity of product sold:"))
cost=int(input("enter the cost of product:"))
discount_percentage=int(input("enter the discount percentage:"))
tax_percentage=int(input("enter the tax percentage:"))
discount=cost*(discount_percentage)/100
cost_after_discount= cost-discount
tax= cost_after_discount*(tax_percentage)/100
total_cost= cost_after_discount+ tax
print(total_cost)
