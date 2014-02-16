/**
 * Simple Evas example using the Buffer engine.
 *
 * You must have Evas compiled with the buffer engine, and have the
 * evas-software-buffer pkg-config files installed.
 *
 * Compile with:
 *
 * @verbatim
 * gcc -o evas-buffer-simple evas-buffer-simple.c `pkg-config --libs --cflags evas evas-software-buffer`
 * @endverbatim
 *
 */
#include <Ecore.h>
#include <Evas.h>
#include <Ecore_Evas.h>
#include <Evas_Engine_Buffer.h>
#include <stdio.h>
#include <errno.h>


///////////////////////////
// start frame smart object
#define _evas_smart_frame_type "Evas_Smart_Frame"
#define EVT_CHILDREN_NUMBER_CHANGED "children,changed"

static const Evas_Smart_Cb_Description _smart_callbacks[] =
{
   {EVT_CHILDREN_NUMBER_CHANGED, "i"},
   {NULL, NULL}
};
typedef struct _Evas_Smart_Frame_Data Evas_Smart_Frame_Data;
/*
 * This structure augments clipped smart object's instance data,
 * providing extra members required by our example smart object's
 * implementation.
 */

struct _Evas_Smart_Frame_Data
{
  Evas_Object_Smart_Clipped_Data base;
  Evas_Object *bg;
  Eina_List                   *children;
};

#define EVAS_SMART_FRAME_DATA_GET(o, ptr) \
  Evas_Smart_Frame_Data * ptr = evas_object_smart_data_get(o)

#define EVAS_SMART_FRAME_DATA_GET_OR_RETURN(o, ptr)        \
  EVAS_SMART_FRAME_DATA_GET(o, ptr);                       \
  if (!ptr)                                                  \
    {                                                        \
       fprintf(stderr, "No widget data for object %p (%s)!", \
               o, evas_object_type_get(o));                  \
       fflush(stderr);                                       \
       abort();                                              \
       return;                                               \
    }

#define EVAS_SMART_FRAME_DATA_GET_OR_RETURN_VAL(o, ptr, val) \
  EVAS_SMART_FRAME_DATA_GET(o, ptr);                         \
  if (!ptr)                                                    \
    {                                                          \
       fprintf(stderr, "No widget data for object %p (%s)!",   \
               o, evas_object_type_get(o));                    \
       fflush(stderr);                                         \
       abort();                                                \
       return val;                                             \
    }

EVAS_SMART_SUBCLASS_NEW(_evas_smart_frame_type, _evas_smart_frame,
                        Evas_Smart_Class, Evas_Smart_Class,
                        evas_object_smart_clipped_class_get, _smart_callbacks);

/* create and setup a new example smart object's internals */
//tmp color bg
static bg_color[] = {255,255,255};

static void
_evas_smart_frame_smart_add(Evas_Object *o)
{
   EVAS_SMART_DATA_ALLOC(o, Evas_Smart_Frame_Data);

   //tmp color bg
   priv->bg = evas_object_rectangle_add(evas_object_evas_get(o));
   evas_object_color_set(priv->bg, bg_color[0] -= 5, bg_color[1] -= 5, bg_color[2] -= 5, 250);
   int bx,by,bw,bh;
   evas_object_geometry_get(priv->bg, &bx, &by, &bw, &bh);
   evas_object_move(priv->bg, bx + 1, by + 1);
   evas_object_resize(priv->bg,bw - 1, bh - 1);

   evas_object_smart_member_add(priv->bg, o);

   _evas_smart_frame_parent_sc->add(o);
}

static void
_evas_smart_frame_smart_del(Evas_Object *o)
{
   EVAS_SMART_FRAME_DATA_GET(o, priv);
   //удаляем детей

   _evas_smart_frame_parent_sc->del(o);
}

static void
_evas_smart_frame_smart_show(Evas_Object *o)
{
   EVAS_SMART_FRAME_DATA_GET(o, priv);
   //показываем детей
   evas_object_show(priv->bg);
   //   if (priv->children[0]) evas_object_show(priv->children[0]);
   //if (priv->children[1]) evas_object_show(priv->children[1]);
   //evas_object_show(priv->border);

   _evas_smart_frame_parent_sc->show(o);
}

static void
_evas_smart_frame_smart_hide(Evas_Object *o)
{
   EVAS_SMART_FRAME_DATA_GET(o, priv);
   //скрываем детей
   evas_object_hide(priv->bg);

   _evas_smart_frame_parent_sc->hide(o);
}

static void
_evas_smart_frame_smart_resize(Evas_Object *o,
			       Evas_Coord   w,
			       Evas_Coord   h)
{
   Evas_Coord ow, oh;
   evas_object_geometry_get(o, NULL, NULL, &ow, &oh);
   if ((ow == w) && (oh == h)) return;

   /* this will trigger recalculation */
   evas_object_smart_changed(o);
}

/* act on child objects' properties, before rendering */
static void
_evas_smart_frame_smart_calculate(Evas_Object *o)
{
   Evas_Coord x, y, w, h;

   EVAS_SMART_FRAME_DATA_GET_OR_RETURN(o, priv);
   evas_object_geometry_get(o, &x, &y, &w, &h);

   evas_object_move(priv->bg, x + 1, y + 1);
   evas_object_resize(priv->bg,w - 1, h - 1);
   
   //move resize all children etc

}

/* setting our smart interface */
static void
_evas_smart_frame_smart_set_user(Evas_Smart_Class *sc)
{
   /* specializing these two */
    sc->add = _evas_smart_frame_smart_add;
    sc->del = _evas_smart_frame_smart_del;
    sc->show = _evas_smart_frame_smart_show;
    sc->hide = _evas_smart_frame_smart_hide;

    /* clipped smart object has no hook on resizes or calculations */
    sc->resize = _evas_smart_frame_smart_resize;
    sc->calculate = _evas_smart_frame_smart_calculate;
}

/* BEGINS example smart object's own interface */

/* add a new example smart object to a canvas */
Evas_Object *
evas_smart_frame_add(Evas *evas)
{
   return evas_object_smart_add(evas, _evas_smart_frame_smart_class_new());
}


Evas_Object *
evas_smart_frame_remove(Evas_Object *o,
			  Evas_Object *child)
{
   int index;
   
   EVAS_SMART_FRAME_DATA_GET_OR_RETURN_VAL(o, priv, NULL);

   //   if (priv->children[0] != child && priv->children[1] != child)
   //  {
   //     fprintf(stderr, "You are trying to remove something not belonging to"
   //                        " the example smart object!\n");
//      return NULL;
//   }

   //   index = (int)evas_object_data_get(child, "index");
   //index--;

   //_evas_smart_example_remove_do(priv, child, index);

   //evas_object_smart_callback_call(
   //  o, EVT_CHILDREN_NUMBER_CHANGED, (void *)priv->child_count);
   //evas_object_smart_changed(o);

   //   return child;
}
// end frame smart object
/////////////////////

// start common element functions
/////////////////////////////////

void ui_element_resize(int element_id, int w, int h){
}

void ui_element_move(int element_id, int x, int y){
}

void ui_element_color_set(int element_id, int r, int g, int b, int a){
}

void ui_element_rotate(int element_id, int deg){
}

// end common element functions
///////////////////////////////


struct id_keeper{
  int counter;
  Eina_Trash *free_id;
  int64_t id_array[1];
};

struct id_keeper* id_keeper_init(int size){
  struct id_keeper *keeper = (struct id_keeper*) malloc(sizeof(struct id_keeper) + size*sizeof(int64_t));
  keeper->counter = 0;
  keeper->free_id = NULL;
}

int id_keeper_gen(struct id_keeper *keeper, void *data){
  if(keeper->free_id)
    return ((int64_t*)eina_trash_pop(&keeper->free_id)) - keeper->id_array;
  else {
    keeper->id_array[keeper->counter] = (int64_t)data;
    //FIXME сделать расширение с помощью realloc
    return keeper->counter++;
  }
}

void id_keeper_free(struct id_keeper *keeper, int64_t id){
  if(!keeper->free_id)
    eina_trash_init(&keeper->free_id);
  eina_trash_push(&keeper->free_id, &keeper->id_array[id]);
}

struct id_keeper *id_keeper;

struct ui_object{
  int xp, yp, hp, wp; // in percents
  int x, y, h, w;
  int angle;
  int rgba[4];
};

struct ui_frame{
  struct ui_object ui;
  Evas *canvas;
  void *data;

  struct Eina_List *childs;
};

struct _frame_window{
  Ecore_Evas *canvas;
};

int64_t ui_wiondow_frame_create(struct ui_object *frame){
  ecore_evas_init();
  
  // create your canvas
   // NOTE: consider using ecore_evas_buffer_new() instead!
  
  struct _frame_window *fwin = (struct _frame_window*) malloc(sizeof(struct _frame_window));
  
  char *data;

  Eina_List *l, *engines = ecore_evas_engines_get();
  printf("Available engines:\n");
  EINA_LIST_FOREACH(engines, l, data)
    printf("%s\n", data);
  ecore_evas_engines_free(engines);
  
  fwin->canvas = ecore_evas_new("opengl_x11", 0, 0, frame->w, frame->h, NULL);
  if (!fwin->canvas)
    return -1;

  ecore_evas_show(fwin->canvas);  
  
  struct ui_frame *frame_obj = (struct _ui_window*) malloc(sizeof(struct ui_frame));
  frame_obj->data = fwin;
  frame_obj->ui = *frame;
  frame_obj->canvas = ecore_evas_get(fwin->canvas);
  
  return id_keeper_gen(id_keeper, frame_obj);
}

int ui_evas_frame_create(int frame_id, struct ui_object *frame){

}

void ui_evas_frame_destroy(int id){
}

void ui_evas_frame_add(int frame_id, int child_id){
}

void ui_evas_frame_remove(int frame_id, int child_id){
}

void ui_get_info(int frame_id){
}


static void destroy_canvas(Ecore_Evas *canvas);

int main(void)
{
  id_keeper = id_keeper_init(1000); //хеш хранения всех объектов по id

  struct ui_object wconf;
  wconf.h = 800;
  wconf.w = 1600;
  
  int64_t main_id = ui_frame_create_window(&wconf);
  //printf("id is %d\n", main_id);
  //struct ui_frame *main = (struct ui_frame*) id_keeper->id_array[main_id];

  //  printf("Hello %d\n", main->canvas);
  //Evas_Object *bg, *r1, *r2, *r3;
  //bg = evas_object_rectangle_add(main->canvas);
  //evas_object_color_set(bg, 255, 255, 255,150); // white bg
  //evas_object_move(bg, 100, 100);                    // at origin
  //evas_object_resize(bg, main->ui.w, main->ui.h);         // covers full canvas
  //evas_object_show(bg);

  //  Evas_Object *grid = evas_object_grid_add(main->canvas);
  //evas_object_grid_size_set(grid, 400, 400);
  //evas_object_show(grid);

  struct ui_object frame_ui;
  frame_ui.h = 600;
  frame_ui.w = 1000;
  int64_t main_f = ui_evas_frame_create(main_id, &frame_ui);
  //Evas_Object *main_f = evas_smart_frame_add(main->canvas);
					//evas_object_move(main_f, 20, 20);
					//  evas_object_resize(main_f, 100, 100);
					//evas_object_show(main_f);
  
  //rotate
  Evas_Map *m = evas_map_new(4);
  evas_map_util_points_populate_from_object(m, main_f);
  int cx, cy, cw, ch;
  evas_object_geometry_get(main_f, &cx, &cy, &cw, &ch);
  evas_map_util_rotate(m, 30, cx + cw, cy + ch);
  evas_object_map_enable_set(main_f, EINA_TRUE);
  evas_object_map_set(main_f, m);

  puts("initial scene, with just background:");


  /*
   //   Evas_Object *cube =  evas_object_rectangle_add(canvas_win);
      Evas_Object *cube =  evas_object_image_filled_add(main->canvas);
   evas_object_image_file_set(cube, "./balalaika.svg", NULL);
   evas_object_color_set(cube, 0, 255, 255, 200); // white bg
   evas_object_move(cube, 700, 400);                    // at origin
   
   int csize[2];
   csize[0] = 30;
   csize[1] = 20;
   
   int cpos[2];
   cpos[0] = 700;
   cpos[1] = 400;

   //   evas_object_resize(cube, csize[0], csize[1]);         // covers full canvas
   evas_object_resize(cube, 400, 300);         // covers full canvas
   evas_object_show(cube);
   //   evas_object_anti_alias_set(cube, 1);
   //      evas_object_render_op_set(cube, EVAS_RENDER_BLEND);
   //   evas_object_image_smooth_scale_set(cube, EINA_TRUE);
   
   int deg = 1;
   int cx, cy, cw, ch;
   Evas_Map *m = evas_map_new(4);
   
   //   evas_map_point_image_uv_set(m, 0, 0, 0);
   // evas_map_point_image_uv_set(m, 1, 150, 0);
   //evas_map_point_image_uv_set(m, 2, 150, 200);
   //evas_map_point_image_uv_set(m, 3, 0, 200);

   Ecore_Task_Cb _cube_anim(void *data){
     evas_map_util_points_populate_from_object(m, cube);
     evas_object_geometry_get(cube, &cx, &cy, &cw, &ch);
     evas_map_util_rotate(m, ++deg, cx + cw, cy + ch);
     evas_object_map_enable_set(cube, EINA_TRUE);
     evas_object_map_set(cube, m);
     
     
     evas_object_move(cube, (cpos[0] = cpos[0] - 5) >=0 ? cpos[0] : 0, (cpos[1] = cpos[1] - 5) >=0 ? cpos[1] : 0);
     evas_object_resize(cube, csize[0] = csize[0] + 1, csize[1] = csize[1] + 1);
     //evas_object_image_filled_set(cube, EINA_TRUE);
     //evas_render(canvas_win);
     return ECORE_CALLBACK_DONE;
	  //	  Ecore_Timer *timer1 = ecore_timer_loop_add(0.4, timer_func, NULL);
   }

   ecore_animator_frametime_set(1./30);
   Ecore_Animator *anim = ecore_animator_add(_cube_anim,cube);
   //   ecore_animator_timeline_add(20,_cube_anim, cube);
   
   ecore_animator_thaw(anim);
  */
   ecore_main_loop_begin();

   //ecore_animator_del(anim);
   //evas_map_free(m);
   //*/
   //   destroy_canvas(main->datacanvas);

   evas_shutdown();

   return 0;
}

static void destroy_canvas(Ecore_Evas *canvas)
{
   Evas_Engine_Info_Buffer *einfo;

   //einfo = (Evas_Engine_Info_Buffer *)ecore_evas_engine_info_get(canvas);
   //if (!einfo)
   //  {
   //     fputs("ERROR: could not get evas engine info!\n", stderr);
   //     ecore_evas_free(canvas);
   //     return;
   //  }

   free(einfo->info.dest_buffer);
   ecore_evas_free(canvas);
}


