-- Collaborator – Grow Together
-- Sample data: 12 realistic listings from rural Maharashtra.
-- Run after db/schema.sql, in the Supabase dashboard SQL Editor.

INSERT INTO listings (title, description, type, sector, location, provider_name, contact_name) VALUES
(
  'Eco-friendly packaging for food products',
  'We make paper pouches, cardboard boxes and printed labels for food items. Small orders welcome, delivery across Kolhapur district.',
  'offer', 'Packaging', 'Kolhapur', 'Shree Packaging Solutions', 'Suresh Patil'
),
(
  'Need packaging help for spice powders',
  'Our family makes Malvani spice mixes. We need sturdy pouches and labels so we can sell in shops outside our village.',
  'need', 'Packaging', 'Malvan, Sindhudurg', 'Malvan Spice House', 'Lata Sawant'
),
(
  'Social media marketing for rural brands',
  'We shoot simple product photos and videos and run WhatsApp and Instagram pages for village businesses.',
  'offer', 'Marketing', 'Nashik', 'Digital Saathi', 'Imran Sheikh'
),
(
  'Need weekly transport for vegetables to Pune market',
  'We grow tomatoes and onions in Satara. Need a tempo every Tuesday and Friday to carry produce to Pune mandai.',
  'need', 'Transport', 'Satara', 'Sahyadri Farms', 'Anil Jadhav'
),
(
  'Tempo service for farm produce, Pune to Mumbai',
  'One tempo available three days a week. Fair rates, careful handling, on-time pickup from farms near Pune.',
  'offer', 'Transport', 'Pune', 'Shiv Transport Services', 'Rahul Shinde'
),
(
  'Need help setting up an online shop for Warli art',
  'We are Warli artists from Palghar. We need someone to help us list our paintings online and take orders.',
  'need', 'Digital Help', 'Palghar', 'Warli Handicrafts', 'Jaya Valvi'
),
(
  'Basic computer and smartphone training',
  'We teach billing apps, UPI payments, email and online forms to small business owners, in Marathi and Hindi.',
  'offer', 'Digital Help', 'Nagpur', 'TechMitra', 'Priya Deshmukh'
),
(
  'Need advice to set up a mango pulp unit',
  'We have an Alphonso orchard in Ratnagiri. Need guidance on machines, FSSAI licence and buyers for mango pulp.',
  'need', 'Food Processing', 'Ratnagiri', 'Konkan Agro Foods', 'Vikram Rane'
),
(
  'Share our milk chilling unit',
  'Our dairy collective in Sangli has a chilling unit with spare capacity. Nearby farmers can store milk with us daily.',
  'offer', 'Dairy', 'Sangli', 'Gokul Dairy Collective', 'Sunita Mane'
),
(
  'Looking for joint orders for handloom towels',
  'Our weaver group in Solapur can make handloom towels and bedsheets in bulk. Looking for shops and bulk buyers to work with.',
  'need', 'Textiles', 'Solapur', 'Solapur Weavers Group', 'Kavita Kamble'
),
(
  'Help with exhibition stalls and craft marketing',
  'We help artisans book exhibition stalls, print banners and set fair rates for their crafts for city buyers.',
  'offer', 'Handicrafts', 'Chhatrapati Sambhajinagar', 'Paithani Weaves', 'Nikhil Joshi'
),
(
  'Need jar labels and packaging design for pickles',
  'We make homemade pickles in Mumbai. Need attractive labels and safe jars so our pickles can reach more shops.',
  'need', 'Packaging', 'Mumbai', 'Aai''s Pickles', 'Meena Kulkarni'
);
