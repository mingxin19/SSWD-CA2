/*

This T-SQL script creates a MS MSQL database with sample data



Tables:



-----------

| AppUser |

-----------

------------

| Author |

------------

    1|

     |

	M|

------------	 

| Novel  |

------------



------------

| Type     |

------------

    1|

     |

	M|

------------	 

| Novel    |

------------





*/



/****** Object:  Table [dbo].[AppUser]    Script Date: 19/09/2019 09:51:01 ******/

SET ANSI_NULLS ON

GO

SET QUOTED_IDENTIFIER ON

GO

CREATE TABLE [dbo].[AppUser](

	[User_Id] [int] IDENTITY(1,1) NOT NULL,

	[First_Name] [nvarchar](255) NULL,

	[Last_Name] [nvarchar](255) NULL,

	[Email] [nvarchar](255) NOT NULL,

	[Password] [nvarchar](255) NOT NULL,

	[Role] [nvarchar](10) NOT NULL

PRIMARY KEY CLUSTERED 

(

	[User_Id] ASC

)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]

) ON [PRIMARY]

GO






/****** Object:  Table [dbo].[Author]    Script Date: 19/09/2019 09:51:01 ******/

SET ANSI_NULLS ON

GO

SET QUOTED_IDENTIFIER ON

GO

CREATE TABLE [dbo].[Author](

	[Author_Id] [int] IDENTITY(1,1) NOT NULL,

	[Author_Name] [nvarchar](255) NOT NULL,

	[Author_Announcement] [nvarchar](255) NULL,

    [No_Novels] [int] NOT NULL,

PRIMARY KEY CLUSTERED 

(

	[Author_Id] ASC

)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]

) ON [PRIMARY]

GO






/****** Object:  Table [dbo].[Link]    Script Date: 19/09/2019 09:51:01 ******/

SET ANSI_NULLS ON

GO

SET QUOTED_IDENTIFIER ON

GO

CREATE TABLE [dbo].[Type](

	[Type_Id] [int] IDENTITY(1,1) NOT NULL,

	[Type_Name] [nvarchar](255) Not NULL,

	[Type_amount] [int] NULL,

PRIMARY KEY CLUSTERED 

(

	[Type_Id] ASC

)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]

) ON [PRIMARY]

GO






/****** Object:  Table [dbo].[Product]    Script Date: 19/09/2019 09:51:01 ******/

SET ANSI_NULLS ON

GO

SET QUOTED_IDENTIFIER ON

GO

CREATE TABLE [dbo].[Novel](

	[Novel_Id] [int] IDENTITY(1,1) NOT NULL,

	[Author_Id] [int] NOT NULL,

    [Type_Id] [int] NOT NULL,

	[Novel_Name] [nvarchar](255) NOT NULL,

	[Novel_Description] [nvarchar](255) NOT NULL,

	[Novel_Word_Count] [int] NOT NULL,

	[Novel_Like] [int] NOT NULL,

PRIMARY KEY CLUSTERED 

(

	[Novel_Id] ASC

)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]

) ON [PRIMARY]

GO






/****** Object:  Table [dbo].[Topic]    Script Date: 19/09/2019 09:51:01 *****

SET ANSI_NULLS ON

GO

SET QUOTED_IDENTIFIER ON

GO

CREATE TABLE [dbo].[Topic](

	[TopicId] [int] IDENTITY(1,1) NOT NULL,

	[TopicName] [nvarchar](255) NOT NULL,

	[TopicDescription] [nvarchar](255) NULL,

PRIMARY KEY CLUSTERED 

(

	[TopicId] ASC

)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]

) ON [PRIMARY]

GO*/






SET IDENTITY_INSERT [dbo].[AppUser] ON 

GO

INSERT [dbo].[AppUser] ([User_Id], [First_Name], [Last_Name], [Email], [Password], [Role]) VALUES (1, N'Alice', N'Admin', N'alice@web.com', N'password', N'admin')

GO

INSERT [dbo].[AppUser] ([User_Id], [First_Name], [Last_Name], [Email], [Password], [Role]) VALUES (2, N'Bob', N'Manager', N'bob@web.com', N'password', N'manager')

GO

INSERT [dbo].[AppUser] ([User_Id], [First_Name], [Last_Name], [Email], [Password], [Role]) VALUES (3, N'Eve', N'User', N'eve@web.com', N'password', N'user')

GO

SET IDENTITY_INSERT [dbo].[AppUser] OFF

GO






SET IDENTITY_INSERT [dbo].[Author] ON 

GO

INSERT [dbo].[Author] ([Author_Id], [Author_Name], [Author_Announcement], [No_Novels]) VALUES (1, N'Mark F', N'Can not upload new chapter due to illness.', 6)

GO

INSERT [dbo].[Author] ([Author_Id], [Author_Name], [Author_Announcement], [No_Novels]) VALUES (2, N'Frank D', N'This author is too lazy to leave any notice', 1)

GO

INSERT [dbo].[Author] ([Author_Id], [Author_Name], [Author_Announcement], [No_Novels]) VALUES (3, N'David P', N'New novel is coming soon!!', 4)

GO

INSERT [dbo].[Author] ([Author_Id], [Author_Name], [Author_Announcement], [No_Novels]) VALUES (4, N'Lee H', N'Today, I uploaded 3 new chapters! Thank you for supporting me', 9)

GO

INSERT [dbo].[Author] ([Author_Id], [Author_Name], [Author_Announcement], [No_Novels]) VALUES (5, N'Connor L', N'There will be an upload of 3,000 words chapter coming tomorrow!', 13)

GO

SET IDENTITY_INSERT [dbo].[Author] OFF

GO






SET IDENTITY_INSERT [dbo].[Type] ON 

GO

INSERT [dbo].[Type] ([Type_Id], [Type_Name], [Type_amount]) VALUES (1, N'Ancient', 2)

GO

INSERT [dbo].[Type] ([Type_Id], [Type_Name], [Type_amount]) VALUES (2, N'Romance', 1)

GO

INSERT [dbo].[Type] ([Type_Id], [Type_Name], [Type_amount]) VALUES (3, N'Sci-fi', 2)

GO

INSERT [dbo].[Type] ([Type_Id], [Type_Name], [Type_amount]) VALUES (4, N'Military', 1)

GO

INSERT [dbo].[Type] ([Type_Id], [Type_Name], [Type_amount]) VALUES (5, N'Horror', 1)

GO

SET IDENTITY_INSERT [dbo].[Type] OFF

GO






SET IDENTITY_INSERT [dbo].[Novel] ON 

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (1, 4, 1, N'Queen of God', N'She, a genius girl abandoned by the family in the 21st century; he, the princess of the black empire who is proud of the belly, became the supreme king when she was angry;', 3756321, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (2, 4, 3, N'Xueba Black Technology System', N'System, can points be exchanged for money? ; No. ; Then what do I want you for! ; This system allows you to be a school bully, what do you want money for?', 361536, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (3, 2, 5, N'Human Taboo', N'They, this is not the end, death is the ultimate destination. Thousands taboos, taboos for eating, taboos for sleeping, and even taboos for your love. The offenders, when they are small, save money and avoid disasters.', 292353, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (4, 1, 4, N'Mercenary war', N'In an accident, Gao Yang ran to Africa, but unfortunately encountered an air crash and was lucky to survive, but then he could only eat at the muzzle because he became a mercenary.', 7155632, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (5, 1, 3, N'Daddy''s Alien Restaurant', N'There is a strange restaurant in the chaotic city of the Nolan continent. Here, elves, dwarfs, orcs are strictly prohibited from making noise, dragons are sitting in front of the restaurant, and the devil''s own stool', 3519875, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (6, 3, 1, N'Time Travel of A Girl Counterattack', N'Ning Shu was dead, and fortunately he became a tasker who counterattacked the bitter cannon fodder. Therefore, Ning Shu, in one world after another, played various roles in life through the protagonist and reborn.', 8549758, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (7, 5, 2, N'Our childhood', N'Youth is a river that does not go against current. And my youth is inseparable from my sister Wang Xuan. If youth can go against the flow, the day she leaves home, I will catch up with her without a second thought. Tell her I love her.', 1094521, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (8, 2, 2, N'Peerless Valkyrie', N'This world respects martial arts, and martial arts are strong and fit! Five states in the world, Dongzhou is the strongest and countless denominations! Weak South Island! And see me Qin Kai rising from Nanzhou!', 2325842, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (9, 3, 2, N'My House', N'I saw a girl in my house, she''s exactly like me except the gender. I fall in love with her, what should I do now?', 514564, 0)

GO

INSERT [dbo].[Novel] ([Novel_Id], [Author_Id], [Type_Id], [Novel_Name], [Novel_Description], [Novel_Word_Count], [Novel_Like]) VALUES (10, 5, 5, N'Seeing you', N'A woman keep getting text from an unknown with a picture of herself when she''s outdoor', 2156236, 0)

GO

SET IDENTITY_INSERT [dbo].[Novel] OFF

GO






ALTER TABLE [dbo].[Novel]  WITH CHECK ADD FOREIGN KEY([Author_Id])

REFERENCES [dbo].[Author] ([Author_Id])

GO

ALTER TABLE [dbo].[Novel]  WITH CHECK ADD FOREIGN KEY([Type_Id])

REFERENCES [dbo].[Type] ([Type_Id])

GO

