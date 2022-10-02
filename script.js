   //Блок констант
    const Info_drop_ballast=["Сбросить 50 кг","Сбросить 20 кг","Сбросить 10 кг","Отменить действие"];
    const Info_default=["Сбросить балласт","Увеличить тягу на 10 миль","Уменьшить тягу на 10 миль","Повернуть батискаф","Ничего не делать"];
	const Info_vector=["на север","на юг","на запад","на восток","на северо-запад","на северо-восток","на юго-запад","на юго-восток","Отменить действие"];
	const vectors=[[0,1],[0,-1],[-1,0],[1,0],[-1,1],[1,1],[-1,-1],[1,-1]];
   //------------------------------------
   //---Условия победы
   var Required_below=Randomize(700,400)*10;
   var Required_minX=-40;
   var Required_minY=-40;
   var Required_maxX=40;
   var Required_maxY=40;
   //-----------------
   //--Описание моря--
   var sea_vector=Randomize(3,0);
   var speed_flow=Randomize(3,1)*10;
   //-----------------
   //---Описание батискафа
   var bath_speed=0;
   var bath_below=0;
   var bath_vector=Randomize(7,0);
   var bath_ballast=1300;
   var bath_State=0;
   var bath_horizontal_speed=0;
   var bath_X=Randomize(40,10)*10*(Math.round(Math.random())?1:-1)/*Добавляем вероятность отрицательного числа*/;
   var bath_Y=Randomize(40,10)*10*(Math.round(Math.random())?1:-1)/*Добавляем вероятность отрицательного числа*/;
   //-----------------------
   
    //Функция добавления одного варианта действия
     function addOption (oSelect,text, value, isDefaultSelected, isSelected)
      {
        let oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(text));
        oOption.setAttribute("value", value);
        if (isDefaultSelected) oOption.defaultSelected = true;
        else if (isSelected) oOption.selected = true;
        oSelect.appendChild(oOption);
      }
    //Функция изменения вариантов действия
    function change_select(new_options)
    {
      let sel=document.getElementById("bath_action");
      sel.options.length=0;
      for (let i=0;i<new_options.length;i++) addOption(sel,new_options[i],"v"+i,false,false);
      sel.setAttribute("size",new_options.length);
    }
	//Функция генерации случайного числа
	function Randomize(max,min)
	{
		return Math.floor(Math.random()*((max+1)-min)+min);
	}
	//Главная функция
	function main_action()
	{
		if (bath_State==0) //Если состояние начальное
		{
			let v=document.getElementById("bath_action").value;
			switch (v)
			{
				case "v0": //Выбор пункта "Сброс балласта"
				{
					bath_State=1; //Состояние "сброс балласта"
					Informing_drop_ballast();// Изменяем пункты в меню
					break;
				}
				case "v1": //
				{
					bath_speed+=10;//Увеличиваем скорость
					end_move();
					break;
				}
				case "v2":
				{
					bath_speed-=10;
					end_move();
					break;
				}
				case "v3":
				{
					bath_State=2;
					Informing_change_vector();
					break;
				}
				case "v4":
				{
					end_move();
					break;
				}
			}
			return;
		}
		if (bath_State==1)
		{
			drop_ballast();
		}
		if (bath_State==2)
		{
			turn_bath();			
		}
	}
	//Функция поворота батискафа
	function turn_bath()
	{
		let v=document.getElementById("bath_action").value;
		if (v=="v8") 
		{
			Info_change_to_default();
			bath_State=0;
		}
		else 
		{
			bath_vector=v[1];
			end_move();
		}
	}
	//Функция сброса балласта
	function drop_ballast()
	{
		let v=document.getElementById("bath_action").value;
		switch (v)
		{
			case "v0":
			{
				bath_ballast-=50;
				end_move();
				break;
			}
			case "v1":
			{
				bath_ballast-=20;
				end_move();
				break;
			}
			case "v2":
			{
				bath_ballast-=10;
				end_move();
				break;
			}
			case "v3":
			{
				Info_change_to_default();
				bath_State=0;
				break;
			}
		}
	}
	//Функция завершения хода
	function end_move()
	{
		bath_State=0;
		bath_below+=bath_ballast-1000;
		bath_X+=speed_flow*vectors[sea_vector][0]+bath_speed*vectors[bath_vector][0];
		bath_Y+=speed_flow*vectors[sea_vector][1]+bath_speed*vectors[bath_vector][1];
		bath_informing();
		Info_change_to_default();
		Check_Win_Condition();
	}
	function check() 
	{
		bath_X+=speed_flow*vectors[sea_vector][0]+bath_speed*vectors[bath_vector][0];
		bath_Y+=speed_flow*vectors[sea_vector][1]+bath_speed*vectors[bath_vector][1];
		alert(bath_X+":"+bath_Y);
	}
	//Функция изменения информации при сбросе балласта
	function Informing_drop_ballast()
	{
		change_text("bath_action_legend","Сброс балласта");
		change_select(Info_drop_ballast);
	}
	////Функция изменения информации при смене направления
	function Informing_change_vector()
	{
		change_text("bath_action_legend","Смена направления");
		change_select(Info_vector);
	}
	//Функция возврата к стандартной информации состояния
     function Info_change_to_default()
	 {
		 change_text("bath_action_legend","Действия");
		 change_select(Info_default);		 
	 }		 
	//Функция вывода информации о батискафе
	function bath_informing()
	{
		change_text("sp_bath","Скорость батискафа: "+bath_speed);
		change_text("below_bath","Текущая глубина: "+bath_below);
		change_text("coord_bath","Текущие координаты: X: "+ bath_X+"; Y: "+bath_Y);
		change_text("vector_bath","Направление батискафа: "+Info_vector[bath_vector]);
		change_text("ballast_bath","Количество балласта: "+bath_ballast);
		change_text("vertical_speed_bath","Скорость погружения: "+(bath_ballast-1000));
	}
	//Функция изменения внутреннего текста
	function change_text(id,Text)
	{
		document.getElementById(id).innerHTML=Text;
	}
	//Функция вывода информации
	function Informing()
	{   
	    bath_informing();
		change_text("sea_vector","Направление течения: "+Info_vector[sea_vector]);
		change_text("sea_sp","Скорость течения: "+speed_flow);
		change_text("r_p1","Координаты: X:"+Required_minX+" ..."+Required_maxX+"; Y:"+Required_minY+" ..."+Required_maxY);
		change_text("r_p2","Требуемая глубина "+Required_below);
	}
	function Check_Win_Condition()
	{
		if (bath_below>=Required_below)
		{
			if ((bath_ballast-1000)>100)
			{
			alert("Проигрыш. Скорость превышена. Игра будет перезапущена");
			location.reload();
			}
			else
				{
					if (((bath_X<Required_minX)||(bath_X>Required_maxX))&&((bath_Y<Required_minY)||(bath_Y>Required_maxY)))
						{
							alert("Проигрыш. Вы разбились о скалы");
							location.reload();
						}
							else
								{
									alert("Победа");
									location.reload();
								}
				}
		}
	}