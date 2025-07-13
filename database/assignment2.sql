--Tony Stark added into accounts
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Give Tony Stark the `admin` position
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--Now delete Tony Stark from the list
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

--Replace something for the GM Hummer
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--Perform an inner join for the inventory items in the "Sport" category
SELECT 
    inv.inv_make, 
    inv.inv_model, 
    class.classification_name
FROM 
    public.inventory inv
INNER JOIN 
    public.classification class 
    ON inv.classification_id = class.classification_id
WHERE 
    class.classification_name = 'Sport';

--Update all records in the inventory table to add "/vehicles" to the middle of the file path.
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

