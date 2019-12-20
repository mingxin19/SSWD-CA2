create user webAdmin with password = 'Password@12345'; 
grant select,insert,update,delete on object::dbo.Author to webAdmin; 
grant select,insert,update,delete on object::dbo.Novel to webAdmin; 
grant select,insert,update,delete on object::dbo.AppUser to webAdmin; 
grant select,insert,update,delete on object::dbo.Type to webAdmin; 



create user webManager with password = 'Password@12345'; 
grant select,insert,update,delete on object::dbo.Author to webManager; 
grant select,insert,update,delete on object::dbo.Novel to webManager; 
grant select,insert,update,delete on object::dbo.Type to webManager; 



create user webUser with password = 'Password@12345'; 
grant select on object::dbo.Author to webUser; 
grant select on object::dbo.Novel to webUser; 
grant select on object::dbo.Type to webUser; 