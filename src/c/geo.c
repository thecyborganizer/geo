#include <pebble.h>

static Window *s_window;
static TextLayer *s_txt_layer;
//static char string_lat[] = "0000000000000000";

enum LocKey {
    LATITUDE_KEY = 0x0,
    LONGITUDE_KEY = 0x1
};

static void main_window_load(Window* window);

static void prv_inbox_received_handler(DictionaryIterator *iter, void* context) {
    Tuple *loc_tuple = dict_find(iter, MESSAGE_KEY_latitude);
    char * lat = loc_tuple->value->cstring;
    loc_tuple = dict_find(iter, MESSAGE_KEY_longitude);
    char * lon = loc_tuple->value->cstring;
    loc_tuple = dict_find(iter, MESSAGE_KEY_distance);
    char * dist = loc_tuple->value->cstring;
    loc_tuple = dict_find(iter, MESSAGE_KEY_msg);
    char* msg = loc_tuple->value->cstring;

    APP_LOG(APP_LOG_LEVEL_ERROR, "In the received handler!");

    static char buf[1024];
    snprintf(buf, sizeof(buf), "%s\n%s", dist, msg);
    //snprintf(buf, sizeof(buf), "%s", msg);

    text_layer_set_text(s_txt_layer, buf);
}


static void main_window_load(Window *window) {
    Layer *window_layer = window_get_root_layer(window);
    GRect bounds = layer_get_bounds(window_layer);
    s_txt_layer = text_layer_create(GRect(0,52, bounds.size.w, 100));
    text_layer_set_background_color(s_txt_layer, GColorClear);
    text_layer_set_text_color(s_txt_layer, GColorBlack);

    text_layer_set_font(s_txt_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
    text_layer_set_text_alignment(s_txt_layer, GTextAlignmentCenter);

    layer_add_child(window_layer, text_layer_get_layer(s_txt_layer));
}

static void main_window_unload(Window *window) {
    text_layer_destroy(s_txt_layer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
    DictionaryIterator *out_iter;
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
    }
}


static void prv_init() {
    app_message_register_outbox_sent(NULL);
    app_message_open(256,256);
    app_message_register_inbox_received(prv_inbox_received_handler);
    //app_message_register_outbox_sent(prv_outbox_sent_handler);
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
    //tick_timer_service_subscribe(SECOND_UNIT, tick_handler);
    
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

