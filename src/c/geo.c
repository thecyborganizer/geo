#include <pebble.h>

static Window *s_window;
static TextLayer *s_txt_layer;
static int lat_msb = 0;
static int lat_lsb = 0;
static int lon_msb = 0;
static int lon_lsb = 0;
//static char string_lat[] = "0000000000000000";

enum LocKey {
    LATITUDE_KEY = 0x0,
    LONGITUDE_KEY = 0x1
};

static void main_window_load(Window* window);

static void prv_inbox_received_handler(DictionaryIterator *iter, void* context) {
    Tuple *loc_tuple = dict_find(iter, MESSAGE_KEY_latitude_msb);
    lat_msb = loc_tuple->value->int32;
    loc_tuple = dict_find(iter, MESSAGE_KEY_latitude_lsb);
    lat_lsb = loc_tuple->value->int32;
    loc_tuple = dict_find(iter, MESSAGE_KEY_longitude_msb);
    lon_msb = loc_tuple->value->int32;
    loc_tuple = dict_find(iter, MESSAGE_KEY_longitude_lsb);
    lon_lsb = loc_tuple->value->int32;

    APP_LOG(APP_LOG_LEVEL_ERROR, "In the received handler!");
    main_window_load(s_window);
}
static char buf[] = "000000000000000000000000";

static void main_window_load(Window *window) {
    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);
    s_txt_layer = text_layer_create(GRect(0,PBL_IF_ROUND_ELSE(58,52), bounds.size.w, 50));
    text_layer_set_background_color(s_txt_layer, GColorClear);
    text_layer_set_text_color(s_txt_layer, GColorBlack);

    text_layer_set_font(s_txt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
    text_layer_set_text_alignment(s_txt_layer, GTextAlignmentCenter);

    layer_add_child(window_layer, text_layer_get_layer(s_txt_layer));


    snprintf(buf, sizeof(buf), "%d.%d\n%d.%d", (int)lat_msb, (int)lat_lsb, (int)lon_msb, (int)lon_lsb);
    printf("%s", buf);
    text_layer_set_text(s_txt_layer, buf);
}

static void main_window_unload(Window *window) {
    text_layer_destroy(s_txt_layer);
}

static void prv_init() {
    app_message_register_inbox_received(prv_inbox_received_handler);
    app_message_register_outbox_sent(NULL);
    app_message_open(256,256);
    /*DictionaryIterator *out_iter;
    AppMessageResult result = app_message_outbox_begin(&out_iter);
    if (result == APP_MSG_OK) {
        int value = 0;
        dict_write_int(out_iter, MESSAGE_KEY_longitude, &value, sizeof(int), true);
        result = app_message_outbox_send();
        if (result != APP_MSG_OK) {
            APP_LOG(APP_LOG_LEVEL_ERROR, "Error sending the outbox: %d", (int)result);
        } else {
            APP_LOG(APP_LOG_LEVEL_ERROR, "Success sending the outbox: %d", (int)result);
        }
    } else {
        APP_LOG(APP_LOG_LEVEL_ERROR, "Error preparing the outbox: %d", (int)result);
    }*/

    s_window = window_create();
    window_set_window_handlers(s_window, (WindowHandlers) {
            .load = main_window_load,
            .unload = main_window_unload
            });

    window_stack_push(s_window, false);
}

static void prv_deinit() {
    window_destroy(s_window);
}

int main(void) {
  prv_init();
  app_event_loop();
  prv_deinit();
}

